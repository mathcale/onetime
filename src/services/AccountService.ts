import { Session } from 'next-auth';
import { authenticator } from 'otplib';

import SaveAccountError from '../errors/SaveAccountError';
import type { Account } from '../types';

export const AccountService = {
  getAccounts: async (session: Session): Promise<Account[]> => {
    // @ts-ignore
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

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new SaveAccountError(errorResponse.code, errorResponse.message);
    }

    const data = await response.json();

    return data;
  },
  generateToken: (secret: string): string => {
    return authenticator.generate(secret);
  },
  isTokenValid: (token: string, secret: string): boolean => {
    return authenticator.check(token, secret);
  },
};
