import { canUseWebP } from './utils';

const webp = canUseWebP();

export const mapStyles = [
  {
    url: `https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style${
      webp ? '' : '-png'
    }.json`,
    value: 'OSM Topo',
    label: 'OSM Topo',
    id: 'style',
  },
  {
    url: `https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-fstopo${
      webp ? '' : '-png'
    }.json`,
    value: 'USFS Topo',
    label: 'USFS Topo',
    id: 'fstopo',
  },
  {
    url: `https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-hybrid${
      webp ? '' : '-png'
    }.json`,
    value: 'Aerial Hybrid',
    label: 'Aerial Hybrid',
    id: 'hybrid',
  },
  {
    url: `https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-aerial${
      webp ? '' : '-png'
    }.json`,
    value: 'Aerial',
    label: 'Aerial',
    id: 'aerial',
  },
];

const validMapStyleUrls = [
  'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style.json',
  'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-png.json',
  'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-aerial-png.json',
  'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-aerial.json',
  'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-fstopo-png.json',
  'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-fstopo.json',
  'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-hybrid-png.json',
  'https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-hybrid.json',
];

// Layer ids that display either metric or imperial measurements
// The metric version has _m and the imperial version has _ft suffixes
// By default, metric is set to visibility none; imperial set to visibility true
const metricLayerIds = [
  'contour_index_m',
  'contour_m',
  'contour_label_m',
  'poi_saddle_m',
  'poi_peak_rank1_m',
  'poi_volcano_rank1_m',
];
const imperialLayerIds = [
  'contour_index_ft',
  'contour_ft',
  'contour_label_ft',
  'poi_saddle_ft',
  'poi_peak_rank1_ft',
  'poi_volcano_rank1_ft',
];

// Load mapStyle and switch to metric units if necessary
export function loadMapStyle({ url, mapUnitsMetric }) {
  // Make sure provided url is valid
  // If not, just return the default OSM Topo style
  if (!validMapStyleUrls.includes(url)) {
    return fetch(validMapStyleUrls[0]).then(response => response.json());
  }
  // Fetch url
  return fetch(url)
    .then(response => response.json())
    .then(json => {
      // If mapUnitsMetric is true, then set the metric layer visiblity to true
      // and the imperial layer visibilities to none
      if (!mapUnitsMetric) {
        return json;
      }

      // Loop over layers in style JSON
      for (const layer of json.layers) {
        // If the layer is a metric layer, turn on visibility
        if (metricLayerIds.includes(layer.id)) {
          layer.layout = layer.layout || {};
          layer.layout.visibility = 'visible';
          console.log(layer);
        }

        if (imperialLayerIds.includes(layer.id)) {
          layer.layout = layer.layout || {};
          layer.layout.visibility = 'none';
          console.log(layer);
        }
      }
      return json;
    });
}
