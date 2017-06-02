import React from 'react';
import { render } from 'react-dom';
import 'normalize.css/normalize.css';
import { injectGlobal } from 'styled-components';

import App from './components/App';

// eslint-disable-next-line
injectGlobal`
  * {
    box-sizing: border-box;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

render(<App />, document.getElementById('app'));
