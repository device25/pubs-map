// Metres per pixel math
// The distance represented by one pixel (S) is given by
//
// S=C*cos(y)/2^(z+8)
// where...
//
// C is the (equatorial) circumference of the Earth
// z is the zoom level
// y is the latitude of where you're interested in the scale.

export const metersPerPixel = (latitude, zoomLevel) => {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  // eslint-disable-next-line
  return ((earthCircumference * Math.cos(latitudeRadians)) / Math.pow(2, zoomLevel + 8));
};

export const pixelValue = (latitude, meters, zoomLevel) => (
  meters / metersPerPixel(latitude, zoomLevel)
);
