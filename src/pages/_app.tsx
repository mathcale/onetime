import 'reflect-metadata';

import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';

import type { AppProps } from 'next/app';

import theme from '../utils/theme';

import 'notyf/notyf.min.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;
