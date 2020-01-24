import { navigate } from 'gatsby';

// From https://stackoverflow.com/a/27232658
// Note that this still returns false on Firefox, but it's better than nothing
export function canUseWebP() {
  if (typeof document === 'undefined') {
    return false;
  }
  var elem = document.createElement('canvas');

  if (!!(elem.getContext && elem.getContext('2d'))) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // very old browser like IE 8, canvas not supported
  return false;
}

// Determine where in the layer hierarchy new layers should be placed
// layerType: 'raster' or 'vector'
// mapStyle: string for style URL
export const beforeId = ({ layerType, mapStyle }) => {
  // name of style, e.g. 'style.json' or 'style-hybrid.json' or 'style-aerial-png.json'
  const name = mapStyle.split('/').slice(-1)[0];
  // If layer is to be placed on top, return null
  const placeOnTop = null;
  if (name.startsWith('style-aerial') || name.startsWith('style-fstopo')) {
    return placeOnTop;
  }

  // Otherwise, place layer in the middle of the layer hierarchy
  // For now, 'building' is hardcoded as the layer below which to place the layer
  // This puts the layer below labels and POIs but above most everything else
  // In the future, I can change where raster and vector layers get put
  let placeInMiddle;
  if (layerType === 'raster') {
    placeInMiddle = 'building';
  } else if (layerType === 'vector') {
    placeInMiddle = 'building';
  } else {
    placeInMiddle = 'building';
  }
  return placeInMiddle;
};

// Default initial viewport settings
// These are overwritten by the URL hash if it exists
const initialViewState = {
  bearing: 0,
  latitude: 37.8759,
  longitude: -119.3629,
  pitch: 0,
  zoom: 8,
};

// Parse hash from url
// By default, if no hash or hash is invalid, returns initialViewState
export function getInitialViewState(location) {
  const hash = location.hash;
  if (!hash || hash.charAt(0) !== '#') {
    return initialViewState;
  }
  // Split the hash into an array of numbers
  const hashArray = hash
    .substring(1)
    .split('/')
    .map(Number);

  // If hash is not all Numbers, navigate to current page without hash
  // Note that it's not enough to just return initialViewState because the
  // Mapbox GL JS `hash` option is enabled. If you just return
  // initialViewState, MapboxGL JS will get confused.
  if (hashArray.some(Number.isNaN)) {
    navigate(location.pathname);
    return;
  }

  // Destructure the hash into an array with defaults
  // Order of arguments:
  // https://docs.mapbox.com/mapbox-gl-js/api/
  const [
    zoom = initialViewState.zoom,
    latitude = initialViewState.latitude,
    longitude = initialViewState.longitude,
    bearing = initialViewState.bearing,
    pitch = initialViewState.pitch,
  ] = hashArray;
  return {
    bearing: bearing,
    latitude: latitude,
    longitude: longitude,
    pitch: pitch,
    zoom: zoom,
  };
}
