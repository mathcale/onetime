import 'reflect-metadata';
import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import { ChakraProvider } from '@chakra-ui/react';

import theme from '../utils/theme';

import 'notyf/notyf.min.css';
import '../assets/css/styles.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
