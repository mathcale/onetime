import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

import '../assets/css/styles.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
