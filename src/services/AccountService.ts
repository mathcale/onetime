import { Session } from 'next-auth/client';
import { authenticator } from '@otplib/preset-v11';

import type { Account } from '../types';

export const AccountService = {
  getAccounts: async (session: Session): Promise<Account[]> => {
    const response = await fetch(`/api/accounts/${session.user.id}`);
    const data = await response.json();

    return data;
  },
  saveAccount: async (
    userId: string,
    account: string,
    secret: string
  ): Promise<Account | never> => {
    const response = await fetch(`/api/accounts/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account,
        secret,
      }),
    });

    const data = await response.json();

    return data;
  },
  isTokenValid: (token: string, secret: string): boolean => {
    return authenticator.check(token, secret);
  },
};
