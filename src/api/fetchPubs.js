import osmtogeojson from 'osmtogeojson';

export default bbox =>
  new Promise((resolve, reject) =>
    fetch(`https://overpass.openstreetmap.fr/api/interpreter?data=[out:json];node[amenity=pub](${bbox});out;`)
      .then(response => response.json())
      .then(json => resolve(osmtogeojson(json)))
      .catch(err => reject(err)));
