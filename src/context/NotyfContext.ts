import { createContext } from 'react';
import { Notyf } from 'notyf';

export default createContext(
  typeof window !== 'undefined' &&
    new Notyf({
      duration: 2000,
      dismissible: true,
      ripple: false,
      position: { x: 'center', y: 'top' },
    })
);
