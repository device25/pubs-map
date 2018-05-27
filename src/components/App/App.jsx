import React, { PureComponent, Fragment } from 'react';
import { isEmpty } from 'ramda';

import './globalStyles';

import fetchPubs from '../../api/fetchPubs';

// import Search from '../Search';
import Map from '../Map';

class App extends PureComponent {
  state = {
    pubs: {},
    latitude: null,
    longitude: null,
    accuracy: null
    // , filteredPubs: {}
  };

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

      fetchPubs(bbox)
        .then(pubs => this.setState({ pubs }))
        .catch(error => console.error(error));
    }, error => console.error(error));
  }

  // search = (e) => {
  //   const searchQuery = e.target.value.trim();
  //   const result = this.state.pubs.features.filter(feature => (
  //     feature.properties.name && feature.properties.name.toLowerCase().match(searchQuery)
  //   ));
  //
  //   this.setState({
  //     filteredPubs: {
  //       type: 'FeatureCollection',
  //       features: result
  //     }
  //   });
  // }

  render() {
    const {
      pubs, longitude, latitude, accuracy
      // , filteredPubs
    } = this.state;

    if (isEmpty(pubs)) {
      return <h2 style={{ width: '100px', margin: 'auto' }}>loading...</h2>;
    }

    return (
      <Fragment>
        {/* <Search onChange={this.search} /> */}
        <Map
          pubs={pubs}
          // filteredPubs={filteredPubs}
          center={[longitude, latitude]}
          accuracy={accuracy}
        />
      </Fragment>
    );
  }
}

export default App;
