import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export interface TxRecord {
  signature: string;
  blockTime: number | null | undefined;
  err: object | null;
}

export function timeAgo(ts: number | null | undefined): string {
  if (!ts) return 'unknown';
  const seconds = Math.floor(Date.now() / 1000) - ts;
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function shortSig(sig: string): string {
  return `${sig.slice(0, 6)}…${sig.slice(-6)}`;
}

export function useTransactionHistory(limit = 8) {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!publicKey || !connected) {
      setTxs([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const sigs = await connection.getSignaturesForAddress(publicKey, { limit });
      setTxs(
        sigs.map((s) => ({
          signature: s.signature,
          blockTime: s.blockTime,
          err: s.err as object | null,
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch activity');
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, connected, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { txs, loading, error, refresh: fetchHistory };
}
