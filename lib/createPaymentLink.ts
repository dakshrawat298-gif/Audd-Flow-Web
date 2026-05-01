import { PublicKey } from '@solana/web3.js';

export interface PaymentLinkParams {
  recipient: string;
  amount?: number;
  splToken?: string;
  reference?: string | string[];
  label?: string;
  message?: string;
  memo?: string;
}

export function createPaymentLink(params: PaymentLinkParams): string {
  const { recipient, amount, splToken, reference, label, message, memo } = params;

  try {
    new PublicKey(recipient);
  } catch {
    throw new Error('Invalid recipient address');
  }

  if (amount !== undefined && amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  const url = new URL(`solana:${recipient}`);

  if (amount !== undefined) {
    url.searchParams.append('amount', amount.toString());
  }
  if (splToken) {
    new PublicKey(splToken);
    url.searchParams.append('spl-token', splToken);
  }
  if (reference) {
    const refs = Array.isArray(reference) ? reference : [reference];
    refs.forEach((r) => {
      new PublicKey(r);
      url.searchParams.append('reference', r);
    });
  }
  if (label) url.searchParams.append('label', label);
  if (message) url.searchParams.append('message', message);
  if (memo) url.searchParams.append('memo', memo);

  return url.toString();
}
