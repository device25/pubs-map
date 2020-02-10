import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';

// config
import mapToken from '../../config/mapToken';

// utils
import { pixelValue } from '../../utils';

import Container from './Container';

class Map extends PureComponent {
  popup = new mapboxgl.Popup();

  componentDidMount() {
    const { center } = this.props;
    mapboxgl.accessToken = mapToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center,
      zoom: 9,
      minZoom: 8
    });

    this.map.on('load', this.onLoad);
  }

  onLoad = () => {
    const { center, accuracy, pubs } = this.props;

    this.map.addSource('location', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: center
            }
          }
        ]
      }
    });
    this.map.addSource('pubs', {
      type: 'geojson',
      data: pubs
    });

    this.map.addLayer({
      id: 'location',
      type: 'circle',
      source: 'location',
      paint: {
        'circle-color': '#2dd860'
      }
    });
    this.map.addLayer({
      id: 'locationHalo',
      type: 'circle',
      source: 'location',
      paint: {
        'circle-color': 'rgba(45,216,96,.5)',
        'circle-radius': {
          stops: [
            [8, pixelValue(center[1], accuracy, 8)],
            [9, pixelValue(center[1], accuracy, 9)],
            [10, pixelValue(center[1], accuracy, 10)],
            [11, pixelValue(center[1], accuracy, 11)],
            [12, pixelValue(center[1], accuracy, 12)],
            [13, pixelValue(center[1], accuracy, 13)],
            [14, pixelValue(center[1], accuracy, 14)],
            [15, pixelValue(center[1], accuracy, 15)],
            [16, pixelValue(center[1], accuracy, 16)],
            [17, pixelValue(center[1], accuracy, 17)],
            [18, pixelValue(center[1], accuracy, 18)],
            [19, pixelValue(center[1], accuracy, 19)],
            [20, pixelValue(center[1], accuracy, 20)],
            [22, pixelValue(center[1], accuracy, 22)]
          ]
        }
      }
    });
    this.map.addLayer({
      id: 'pubs',
      type: 'circle',
      source: 'pubs',
      paint: {
        'circle-color': '#5c9ed8'
      }
    });
    this.map.addLayer({
      id: 'pubs-names',
      type: 'symbol',
      source: 'pubs',
      layout: {
        'text-field': '{name}',
        'text-anchor': 'bottom'
      }
    });

    this.map.on('mousemove', this.onMouseMove);
  }

  onMouseMove = (e) => {
    const features = this.map.queryRenderedFeatures(
      e.point, { layers: ['pubs'] }
    );
    if (features.length > 0) {
      const { properties } = features[0];

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
      <Container id='map' />
    );
  }
}

Map.propTypes = {
  pubs: PropTypes.object.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  accuracy: PropTypes.number.isRequired
};

export default Map;
