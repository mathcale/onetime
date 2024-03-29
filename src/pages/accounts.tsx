import { useState, useEffect, useRef } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import { Navbar, AccountCard, Loading } from '../components';
import { AccountService } from '../services';
import { useInterval } from '../hooks';
import { useStore } from '../store';

import type { Session } from 'next-auth';
import type { Account } from '../types';

interface AccountsPageProps {
  session: Session;
}

const { NEXT_PUBLIC_BASE_URL } = process.env;

const AccountsPage = ({ session }: AccountsPageProps): JSX.Element => {
  const router = useRouter();

  const accounts = useStore(state => state.accounts);
  const filteredAccounts = useStore(state => state.filteredAccounts);
  const setAccounts = useStore(state => state.setAccounts);

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(AccountService.getTimeRemaining());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const getAccounts = async (): Promise<void | never> => {
    try {
      await AccountService.getAccounts(session);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(AccountService.getTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
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

  const onDeleteAccountClick = async (account: Account): Promise<void | never> => {
    setIsLoading(true);
    onClose();

    try {
      // @ts-ignore
      await AccountService.deleteAccount(session.user.id, account._id);
      await getAccounts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAccountCard = (account: Account): JSX.Element => (
    <AccountCard
      key={account._id}
      accountName={account.account}
      token={account.token}
      onDeleteClick={() => {
        setSelectedAccount(account);
        onOpen();
      }}
    />
  );

  return (
    <>
      <Head>
        <title>Accounts - Onetime: 2FA Keys Manager</title>
      </Head>

      <Navbar />

      <Container maxW="container.xl">
        <Flex>
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

          <Spacer />

          <Stack direction="row" align="center" my="5">
            <CircularProgress value={(timeRemaining / 30) * 100} color="blue.700">
              <CircularProgressLabel>{timeRemaining}s</CircularProgressLabel>
            </CircularProgress>
          </Stack>
        </Flex>

        {isLoading ? (
          <Loading />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={{ base: 5, lg: 8 }} mb="10">
            {filteredAccounts.length > 0
              ? filteredAccounts.map(account => renderAccountCard(account))
              : accounts.map(account => renderAccountCard(account))}
          </SimpleGrid>
        )}
      </Container>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete account?</AlertDialogHeader>
          <AlertDialogCloseButton />

          <AlertDialogBody>
            Are you sure you want to delete <strong>"{selectedAccount?.account}"</strong>?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>

            <Button colorScheme="red" ml={3} onClick={() => onDeleteAccountClick(selectedAccount)}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
