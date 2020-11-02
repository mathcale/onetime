import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, Session } from 'next-auth/client';
import { authenticator } from '@otplib/preset-v11';

import { AccountService } from '../services';
import { Account } from '../types';

interface AccountsPageProps {
  session: Session;
}

const AccountsPage = ({ session }: AccountsPageProps): JSX.Element => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAccounts() {
      try {
        const dbAccounts = await AccountService.getAccounts(session);
        const _accounts = dbAccounts.map(account => ({
          ...account,
          token: authenticator.generate(account.secret),
        }));

        setAccounts(_accounts);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    getAccounts();
  }, []);

  useEffect(() => {
    if (accounts.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      const updatedAccounts = accounts.map(account => {
        return !AccountService.isTokenValid(account.token, account.secret)
          ? {
              ...account,
              token: authenticator.generate(account.secret),
            }
          : account;
      });

      setAccounts(updatedAccounts);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const copy = async (token: string): Promise<void> => {
    await navigator.clipboard.writeText(token);
  };

  return (
    <div>
      <h1>Accounts</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {accounts.map(account => (
            <div key={account._id}>
              <h3>{account.account}</h3>
              <p>{account.token}</p>

              <button type="button" onClick={() => copy(account.token)}>
                Copy
              </button>

              <button type="button">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

export default AccountsPage;
