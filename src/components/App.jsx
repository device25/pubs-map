import React, { Component } from 'react';
import osmtogeojson from 'osmtogeojson';
import { isEmpty } from 'ramda';

import Map from './Map';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: {}
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      // console.log(coords);
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

      fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=pub](${bbox});out;`)
        .then(response => response.json())
        .then(json => this.setState({ features: osmtogeojson(json) }));
    }, error => console.log(error));
  }

  render() {
    const { features, longitude, latitude, accuracy } = this.state;

    return (
      <div>
        {
          isEmpty(features) &&
          <h2 style={{ width: '100px', margin: 'auto' }}>loading...</h2>
        }
        {
          !isEmpty(features) &&
          <Map
            pubs={features}
            center={[longitude, latitude]}
            accuracy={accuracy}
          />
        }
      </div>
    );
  }
}

export default App;
