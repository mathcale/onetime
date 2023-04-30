import { Session } from 'next-auth';
import { authenticator } from 'otplib';

import { useStore } from '../store';
import SaveAccountError from '../errors/SaveAccountError';
import type { Account } from '../types';

const { setAccounts } = useStore.getState();

export const AccountService = {
  async getAccounts(session: Session): Promise<void | never> {
    // @ts-ignore
    const response = await fetch(`/api/users/${session.user.id}/accounts`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    const _accounts = data.map((account: Account) => ({
      ...account,
      token: this.generateToken(account.secret),
    }));

    setAccounts(_accounts);
  },
  saveAccount: async (
    userId: string,
    account: string,
    secret: string
  ): Promise<Account | never> => {
    const response = await fetch(`/api/users/${userId}/accounts`, {
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
  deleteAccount: async (userId: string, accountId: string): Promise<void | never> => {
    const response = await fetch(`/api/users/${userId}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message);
    }
  },
  generateToken: (secret: string): string => {
    return authenticator.generate(secret);
  },
  isTokenValid: (token: string, secret: string): boolean => {
    return authenticator.check(token, secret);
  },
  getTimeRemaining: (): number => {
    return authenticator.timeRemaining();
  },
};
