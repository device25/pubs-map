import React from 'react';
import Map from './Map';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pubs: []
    };
  }

  componentDidMount() {
    fetch('http://overpass-api.de/api/interpreter?data=%3C%3Fxml+version%3D%221.0%22+encoding%3D%22UTF-8%22%3F%3E%3Cosm-script+output%3D%22json%22%3E%0A++%3Cquery+into%3D%22_%22+type%3D%22node%22%3E%0A++++%3Chas-kv+k%3D%22amenity%22+modv%3D%22%22+v%3D%22pub%22%2F%3E%0A++++%3Cbbox-query+e%3D%2238.4796142578125%22+into%3D%22_%22+n%3D%2256.15931775281314%22+s%3D%2254.996524259832526%22+w%3D%2236.54876708984375%22%2F%3E%0A++%3C%2Fquery%3E%0A++%3Cprint+e%3D%22%22+from%3D%22_%22+geometry%3D%22skeleton%22+limit%3D%22%22+mode%3D%22body%22+n%3D%22%22+order%3D%22id%22+s%3D%22%22+w%3D%22%22%2F%3E%0A%3C%2Fosm-script%3E')
      .then(response => response.json())
      .then(json => this.convertToGeoJson(json.elements));
  }

  convertToGeoJson(arr) {
    arr.map(pub => {
      pub.type = "Feature";
      pub.properties = pub.tags;
      pub.geometry = {
        "type": "Point",
        "coordinates": [
          pub.lon,
          pub.lat
        ]
      };
      delete pub.tags;
      delete pub.lat;
      delete pub.lon;
      delete pub.id;
    });

    const geoJson = {
      "type": "FeatureCollection",
      "features": arr
    };
    this.setState({pubs: geoJson})
  }

  render() {
    return (
      <div className="App">
        {
          this.state.pubs.length !== 0 &&
          <Map
            pubs={ this.state.pubs }
          />
        }
      </div>
    );
  }
}

export default App;