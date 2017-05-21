/* global mapboxgl */
import React, { PureComponent } from 'react';
import styled from 'styled-components';

/* eslint-disable max-len */
const accessToken = 'pk.eyJ1IjoiZGV2aWNlMjUiLCJhIjoiY2lzaGN3d2tiMDAxOTJ6bGYydDZrcHptdiJ9.UK55aUzBquqYns1AdnuTQg';
/* eslint-enable max-len */

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
`;

class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidMount() {
    mapboxgl.accessToken = accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: this.props.center,
      zoom: 9
      // style: 'mapbox://styles/device25/ciutqc2xo01152jl8n8vgjkna',
    });

    this.map.on('load', this.onLoad);
  }

  onLoad() {
    this.map.addSource('earthquakes', {
      type: 'geojson',
      // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
      // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
      data: this.props.pubs,
      cluster: true,
      clusterMaxZoom: 20, // Max zoom to cluster points on
      clusterRadius: 160 // Use small cluster radius for the heatmap look
    });
    this.map.addSource('pubs', {
      type: 'geojson',
      data: this.props.pubs
    });

    // Use the earthquakes source to create four layers:
    // three for each cluster category, and one for unclustered points

    // Each point range gets a different fill color.
    const layers = [
      [0, 'green'],
      [20, 'orange'],
      [200, 'red']
    ];

    layers.forEach((layer, i) => {
      this.map.addLayer({
        id: `cluster-${i}`,
        type: 'circle',
        source: 'earthquakes',
        paint: {
          'circle-color': layer[1],
          'circle-radius': 70,
          'circle-blur': 1 // blur the circles to get a heatmap look
        },
        filter: i === layers.length - 1
          ? ['>=', 'point_count', layer[0]]
          : ['all',
            ['>=', 'point_count', layer[0]],
            ['<', 'point_count', layers[i + 1][0]]
          ]
      });
    });

    this.map.addLayer({
      id: 'pubs',
      type: 'circle',
      source: 'pubs',
      paint: {
        'circle-color': '#5c9ed8'
      }
    });

    this.popup = new mapboxgl.Popup();
    this.map.on('mousemove', this.onMouseMove);
  }

  onMouseMove(e) {
    const features = this.map.queryRenderedFeatures(e.point, { layers: ['pubs'] });
    if (features.length > 0) {
      // console.log(features[0]);
      const properties = features[0].properties;

      this.popup
        .setLngLat(e.lngLat)
        .setHTML(`
          <div>${properties.name}</div>
          <div>телефон: ${properties.phone || properties['contact:phone']}</div>
          <div>${properties.website || properties['contact:website']}</div>
        `)
        .addTo(this.map);
    }
  }

  render() {
    return (
      <Wrap id='map' />
    );
  }
}

export default Map;