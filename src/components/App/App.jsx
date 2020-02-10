import React, { PureComponent } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import './global.module.css';

import fetchPubs from '../../api/fetchPubs';

import Map from '../Map';

class App extends PureComponent {
  state = {
    pubs: {},
    latitude: null,
    longitude: null,
    accuracy: null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.setState({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy
      });

      const s = coords.latitude - 0.4;
      const w = coords.longitude - 0.4;
      const n = coords.latitude + 0.4;
      const e = coords.longitude + 0.4;
      const bbox = `${s},${w},${n},${e}`;

      fetchPubs(bbox)
        .then(pubs => this.setState({ pubs }))
        .catch(error => console.error(error));
    }, error => console.error(error));
  }

  render() {
    const {
      pubs, longitude, latitude, accuracy
    } = this.state;

    if (Object.values(pubs).length === 0) {
      return (
        <h2 style={{ width: '100px', margin: 'auto' }}>
          loading...
        </h2>
      );
    }

    return (
      <Map
        pubs={pubs}
        center={[longitude, latitude]}
        accuracy={accuracy}
      />
    );
  }
}

export default App;
