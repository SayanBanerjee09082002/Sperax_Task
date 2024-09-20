import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: '#14161a',
        color: 'white',
        margin: 0,
        padding: 0,
      },
    },
  },
});

export default theme;
