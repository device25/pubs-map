import React, { Component } from 'react';
import { js2xml } from 'xml-js';
import osmtogeojson from 'osmtogeojson';
import { isEmpty } from 'ramda';

import Map from './Map';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: {},
      latitude: null,
      longitude: null
      // latitude: 55.0,
      // longitude: 37.0
    };
  }

  componentDidMount() {
    // const test = '<?xml version="1.0" encoding="UTF-8"?>' +
    //   '<osm-script output="json">' +
    //   '<query into="_" type="node">' +
    //   '<has-kv k="amenity" modv="" v="pub"/>' +
    //   '<bbox-query e="38.4796142578125" into="_" n="56.15931775281314" s="54.996524259832526" w="36.54876708984375"/>' +
    //   '</query>' +
    //   '<print/>' +
    //   '</osm-script>';
    // console.log(xml2json(test, {compact: true}));

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      const xml = {
        _declaration: { _attributes: { version: '1.0', encoding: 'UTF-8' } },
        'osm-script': {
          _attributes: { output: 'json' },
          query: {
            _attributes: { into: '_', type: 'node' },
            'has-kv': {
              _attributes: {
                k: 'amenity',
                modv: '',
                v: 'pub'
              }
            },
            'bbox-query': {
              _attributes: {
                e: `${this.state.longitude + 0.5}`,
                into: '_',
                n: `${this.state.latitude + 0.5}`,
                s: `${this.state.latitude - 0.5}`,
                w: `${this.state.longitude - 0.5}`
              }
            }
          },
          print: {}
        }
      };
      const uri = encodeURIComponent(js2xml(xml, { compact: true }));
      fetch(`https://overpass-api.de/api/interpreter?data=${uri}`)
        .then(response => response.json())
        .then(json => this.setState({ features: osmtogeojson(json) }));
    }, error => console.log(error));
  }

  render() {
    return (
      <div>
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
