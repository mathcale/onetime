import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// @ts-ignore
const theme = extendTheme({ config });

export default theme;
