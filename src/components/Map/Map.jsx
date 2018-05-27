import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';

// config
import mapToken from '../../config/mapToken';

// utils
import { pixelValue } from '../../utils';

// styled
import Container from './styled/Container';

class Map extends PureComponent {
  componentDidMount() {
    mapboxgl.accessToken = mapToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: this.props.center,
      zoom: 9,
      minZoom: 8
      // style: 'mapbox://styles/device25/ciutqc2xo01152jl8n8vgjkna',
    });

    this.map.on('load', this.onLoad);
  }

  // componentWillReceiveProps(nextProps) {
  //   const { filteredPubs } = nextProps;
  //   const source = this.map.getSource('pubs');
  //
  //   if (source) {
  //     source.setData(filteredPubs);
  //   }
  // }

  onLoad = () => {
    const { center, accuracy } = this.props;

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
              coordinates: this.props.center
            }
          }
        ]
      }
    });
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
    const features = this.map.queryRenderedFeatures(e.point, { layers: ['pubs'] });
    if (features.length > 0) {
      // console.log(features[0]);
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

  popup = new mapboxgl.Popup();

  render() {
    return <Container id='map' />;
  }
}

Map.propTypes = {
  pubs: PropTypes.object.isRequired,
  // filteredPubs: PropTypes.object.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  accuracy: PropTypes.number.isRequired
};

export default Map;
