/* global mapboxgl */
import React from 'react';
import './map.css';

/* eslint-disable max-len */
const accessToken = 'pk.eyJ1IjoiZGV2aWNlMjUiLCJhIjoiY2lzaGN3d2tiMDAxOTJ6bGYydDZrcHptdiJ9.UK55aUzBquqYns1AdnuTQg';
/* eslint-enable max-len */

class Map extends React.Component {
  componentDidMount() {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/device25/ciutqc2xo01152jl8n8vgjkna',
    });

    map.on('load', () => {
      map.addSource('pubs', {type: 'geojson', data: this.props.pubs});
      map.addLayer({
        id: 'pubs',
        type: 'circle',
        source: 'pubs',
      });
      map.addLayer({
        "id": "pubsNames",
        'type': 'symbol',
        "source": "pubs",
        'layout': {
          'text-field': '{name}',
          'text-size': 14,
          'text-offset': [0, 0.6]
        }
      });
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div id='map'/>
    );
  }
}

export default Map;