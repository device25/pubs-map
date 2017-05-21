import React, { Component } from 'react';
import osmtogeojson from 'osmtogeojson';
import { isEmpty } from 'ramda';

import Map from './Map';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: {},
      latitude: null,
      longitude: null,
      accuracy: null
      // latitude: 55.0,
      // longitude: 37.0
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
    return (
      <div>
        {
          isEmpty(this.state.features) &&
          <h2>loading...</h2>
        }
        {
          !isEmpty(this.state.features) &&
          <Map
            pubs={this.state.features}
            center={[this.state.longitude, this.state.latitude]}
          />
        }
      </div>
    );
  }
}

export default App;
