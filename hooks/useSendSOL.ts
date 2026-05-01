import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

export interface SendSOLResult {
  signature: string;
}

export function useSendSOL() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const sendSOL = useCallback(
    async (recipient: string, amountSOL: number): Promise<SendSOLResult> => {
      if (!publicKey) throw new Error('Wallet not connected');
      if (amountSOL <= 0) throw new Error('Amount must be greater than 0');

      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch {
        throw new Error('Invalid recipient address');
      }

      setLoading(true);
      setError(null);
      setSignature(null);

      try {
        const lamports = Math.round(amountSOL * LAMPORTS_PER_SOL);

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash('confirmed');

        const tx = new Transaction({
          feePayer: publicKey,
          blockhash,
          lastValidBlockHeight,
        }).add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubkey,
            lamports,
          })
        );

        const sig = await sendTransaction(tx, connection);

        await connection.confirmTransaction(
          { signature: sig, blockhash, lastValidBlockHeight },
          'confirmed'
        );

        setSignature(sig);
        return { signature: sig };
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Transaction failed';
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [connection, publicKey, sendTransaction]
  );

  return { sendSOL, loading, error, signature };
}
