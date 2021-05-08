import Head from 'next/head';
import { signIn, getSession } from 'next-auth/client';
import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';

const { NEXT_PUBLIC_BASE_URL } = process.env;

const IndexPage = (): JSX.Element => {
  const handleLogin = e => {
    e.preventDefault();
    signIn('github', { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/accounts` });
  };

  return (
    <>
      <Head>
        <title>Onetime: 2FA Keys Manager</title>
      </Head>

      <Container maxW="3xl">
        <Stack as={Box} textAlign="center" spacing={{ base: 8, md: 14 }} py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={800}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight="110%"
          >
            Securely manage your 2FA keys in the cloud, <br />
            <Text as="span" color="blue.400">
              for free!
            </Text>
          </Heading>

          <Text color="gray.500">
            Securely manage your 2-Factor Authentication keys in the cloud,{' '}
            <strong>for free!</strong>
          </Text>

          <Stack
            direction="column"
            spacing={3}
            align="center"
            alignSelf="center"
            position="relative"
          >
            <Button
              onClick={handleLogin}
              colorScheme="blue"
              rounded="full"
              px={6}
              py={3}
              bg="blue.400"
              _hover={{
                bg: 'blue.500',
              }}
              flex="1"
              alignItems="center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  fill="#1A202C"
                />
              </svg>

              <Text ml="2">Access with GitHub</Text>
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  if (session) {
    context.res.writeHead(302, { Location: `${NEXT_PUBLIC_BASE_URL}/accounts` }).end();
    return { props: {} };
  }

  return {
    props: {
      session,
    },
  };
};

export default IndexPage;
