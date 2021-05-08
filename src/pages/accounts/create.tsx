import { useState, useContext } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { Container, Stack, Text, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import type { Session } from 'next-auth';

import { Navbar } from '../../components';
import { AccountService } from '../../services';
import NotyfContext from '../../context/NotyfContext';

interface CreateAccountPageProps {
  session: Session;
}

const CreateAccountPage = ({ session }: CreateAccountPageProps): JSX.Element => {
  const [account, setAccount] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const notyf = useContext(NotyfContext);
  const router = useRouter();

  const saveAccount = async (e: React.MouseEvent): Promise<void | boolean> => {
    e.preventDefault();

    if (account === '' || secret === '') {
      notyf.error({
        message: 'All fields are required!',
        duration: 3000,
      });

      return false;
    }

    setIsLoading(true);

    try {
      //@ts-ignore
      await AccountService.saveAccount(session.user.id, account, secret);

      notyf.success({
        message: 'Account successfully saved!',
        duration: 3000,
      });

      router.push('/accounts');
    } catch (err) {
      notyf.error({
        message:
          err.name === 'SaveAccountError'
            ? err.message
            : 'There was a problem while saving this account. Please try again later!',
        duration: 4000,
      });

      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add new account - Onetime: 2FA Keys Manager</title>
      </Head>

      <Navbar />

      <Container maxW="container.xl">
        <Stack direction="row" align="center" my="5">
          <Text fontSize="4xl" fontWeight="bold" mr="2">
            Add new account
          </Text>

          <Button onClick={() => router.push('/accounts')} size="sm" fontSize="sm" rounded="full">
            <ArrowBackIcon mr="2" /> Go back
          </Button>
        </Stack>

        <Stack spacing={5}>
          <FormControl id="accountName">
            <FormLabel>Account name</FormLabel>

            <Input
              type="text"
              onChange={e => setAccount(e.target.value)}
              disabled={isLoading}
              required
            />
          </FormControl>

          <FormControl id="secret">
            <FormLabel>Secret</FormLabel>

            <Input
              type="text"
              onChange={e => setSecret(e.target.value)}
              disabled={isLoading}
              required
            />
          </FormControl>

          <Button
            bg="blue.400"
            color="white"
            _hover={{ bg: 'blue.500' }}
            onClick={saveAccount}
            disabled={isLoading}
          >
            Save
          </Button>
        </Stack>
      </Container>
    </>
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

export default CreateAccountPage;
