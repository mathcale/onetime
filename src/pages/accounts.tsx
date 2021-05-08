import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import { authenticator } from 'otplib';
import type { Session } from 'next-auth';

import { Navbar, AccountCard } from '../components';
import { AccountService } from '../services';
import { useInterval } from '../hooks';
import type { Account } from '../types';

interface AccountsPageProps {
  session: Session;
}

const { NEXT_PUBLIC_BASE_URL } = process.env;

const AccountsPage = ({ session }: AccountsPageProps): JSX.Element => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    getAccounts();
  }, []);

  useInterval(() => {
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

  if (!session && typeof window !== 'undefined') {
    window.location.href = NEXT_PUBLIC_BASE_URL;
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="p-5">
        <div className="py-5">
          <main className="h-full overflow-y-auto">
            <div className="container mx-auto flex flex-row items-center">
              <h1 className="text-3xl font-bold">Accounts</h1>

              <Link href="/accounts/create" passHref>
                <a className="border border-indigo-500 bg-indigo-500 text-white rounded-full px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline text-xs">
                  Add
                </a>
              </Link>
            </div>
          </main>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="py-5">
            <main className="h-full overflow-y-auto">
              <div className="container mx-auto grid">
                <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-5">
                  {accounts.map(account => (
                    <AccountCard
                      key={account._id}
                      accountName={account.account}
                      token={account.token}
                    />
                  ))}
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  if (!session && context.req) {
    context.res.writeHead(302, { Location: NEXT_PUBLIC_BASE_URL }).end();
    return { props: {} };
  }

  return {
    props: {
      session,
    },
  };
};

export default AccountsPage;
