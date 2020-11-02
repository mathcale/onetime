import { Session } from 'next-auth/client';
import { authenticator } from '@otplib/preset-v11';

import type { Account } from '../types';

export const AccountService = {
  getAccounts: async (session: Session): Promise<Account[]> => {
    const response = await fetch(`/api/accounts/${session.user.id}`);
    const data = await response.json();

    return data;
  },
  isTokenValid: (token: string, secret: string): boolean => {
    return authenticator.check(token, secret);
  },
};
