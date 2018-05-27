import 'normalize.css/normalize.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { injectGlobal } from 'styled-components';

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
