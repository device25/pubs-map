import React, { Component } from 'react';
import osmtogeojson from 'osmtogeojson';
import { isEmpty } from 'ramda';

import Search from './Search';
import Map from './Map';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pubs: {},
      filteredPubs: {}
    };
    this.search = this.search.bind(this);
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
        .then(json => this.setState({ pubs: osmtogeojson(json) }));
    }, error => console.log(error));
  }

  search(e) {
    const searchQuery = e.target.value.trim();
    const result = this.state.pubs.features.filter(feature => (
      feature.properties.name && feature.properties.name.toLowerCase().match(searchQuery)
    ));

    this.setState({
      filteredPubs: {
        type: 'FeatureCollection',
        features: result
      }
    });
  }

  render() {
    const { pubs, filteredPubs, longitude, latitude, accuracy } = this.state;

    return (
      <div>
        {
          isEmpty(pubs) &&
          <h2 style={{ width: '100px', margin: 'auto' }}>loading...</h2>
        }
        {
          !isEmpty(pubs) &&
          <div>
            <Search onChange={this.search} />
            <Map
              pubs={pubs}
              filteredPubs={filteredPubs}
              center={[longitude, latitude]}
              accuracy={accuracy}
            />
          </div>
        }
      </div>
    );
  }
}

export default App;
