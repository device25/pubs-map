/* global mapboxgl */
import React from 'react';
import './map.css';

/* eslint-disable max-len */
const accessToken = 'pk.eyJ1IjoiZGV2aWNlMjUiLCJhIjoiY2lzaGN3d2tiMDAxOTJ6bGYydDZrcHptdiJ9.UK55aUzBquqYns1AdnuTQg';
/* eslint-enable max-len */

const Map = React.createClass({
  componentDidMount() {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/device25/ciutqc2xo01152jl8n8vgjkna',
    });

    // map.on('load', () => {
    //   map.addSource('pubs', {type: 'geojson', data: this.props.pubs});
    //   map.addLayer({
    //     id: 'pubs',
    //     type: 'circle',
    //     source: 'pubs',
    //   });
    //   map.addLayer({
    //     "id": "pubsNames",
    //     'type': 'symbol',
    //     "source": "pubs",
    //     'layout': {
    //       'text-field': '{name}',
    //       'text-size': 14,
    //       'text-offset': [0, 0.6]
    //     }
    //   });
    // });
    map.on('load', () => {
      map.addSource("earthquakes", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: this.props.pubs,
        cluster: true,
        clusterMaxZoom: 20, // Max zoom to cluster points on
        clusterRadius: 160 // Use small cluster radius for the heatmap look
      });

      // Use the earthquakes source to create four layers:
      // three for each cluster category, and one for unclustered points

      // Each point range gets a different fill color.
      const layers = [
        [0, 'green'],
        [20, 'orange'],
        [200, 'red']
      ];

      layers.forEach(function (layer, i) {
        map.addLayer({
          "id": "cluster-" + i,
          "type": "circle",
          "source": "earthquakes",
          "paint": {
            "circle-color": layer[1],
            "circle-radius": 70,
            "circle-blur": 1 // blur the circles to get a heatmap look
          },
          "filter": i === layers.length - 1 ?
            [">=", "point_count", layer[0]] :
            ["all",
              [">=", "point_count", layer[0]],
              ["<", "point_count", layers[i + 1][0]]]
        }, 'waterway-label');
      });

      map.addLayer({
        "id": "unclustered-points",
        "type": "circle",
        "source": "earthquakes",
        "paint": {
          "circle-color": 'rgba(0,0,0,0.5)',
        },
        "filter": ["!=", "cluster", true]
      }, 'waterway-label');
    });
  },

  shouldComponentUpdate() {
    return false;
  },

  render() {
    return (
      <div id='map'/>
    );
  }
});

export default Map;