import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { Container, SimpleGrid, Stack, Center, Text, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import type { Session } from 'next-auth';

import { Navbar, AccountCard, Loading } from '../components';
import { AccountService } from '../services';
import { useInterval } from '../hooks';
import type { Account } from '../types';

interface AccountsPageProps {
  session: Session;
}

const { NEXT_PUBLIC_BASE_URL } = process.env;

const AccountsPage = ({ session }: AccountsPageProps): JSX.Element => {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getAccounts() {
      try {
        const dbAccounts = await AccountService.getAccounts(session);
        const _accounts = dbAccounts.map(account => ({
          ...account,
          token: AccountService.generateToken(account.secret),
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
            token: AccountService.generateToken(account.secret),
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
      <Head>
        <title>Accounts - Onetime: 2FA Keys Manager</title>
      </Head>

      <Navbar />

      <Container maxW="container.xl">
        <Stack direction="row" align="center" my="5">
          <Text fontSize="4xl" fontWeight="bold" mr="2">
            Accounts
          </Text>

          <Button
            onClick={() => router.push('/accounts/create')}
            size="sm"
            fontSize="sm"
            rounded="full"
          >
            <AddIcon mr="2" /> Add
          </Button>
        </Stack>

        {isLoading ? (
          <Loading />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={{ base: 5, lg: 8 }} mb="10">
            {accounts.map(account => (
              <AccountCard key={account._id} accountName={account.account} token={account.token} />
            ))}
          </SimpleGrid>
        )}
      </Container>
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
