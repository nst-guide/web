import * as React from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import {
  _MapContext as MapContext,
  StaticMap,
  NavigationControl,
} from 'react-map-gl';
import Image from '../Image';
import Select from 'react-select';

// Default initial viewport settings
// These are overwritten by the URL hash if it exists
const initialViewState = {
  bearing: 0,
  latitude: 37.8759,
  longitude: -119.3629,
  pitch: 0,
  zoom: 8,
};

// From https://stackoverflow.com/a/27232658
// Note that this still returns false on Firefox, but it's better than nothing
function canUseWebP() {
  var elem = document.createElement('canvas');

  if (!!(elem.getContext && elem.getContext('2d'))) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
  }

  // very old browser like IE 8, canvas not supported
  return false;
}

const webp = canUseWebP();

const mapStyles = [
  {
    value: `https://raw.githubusercontent.com/nst-guide/osm-liberty/gh-pages/style${
      webp ? '' : '-png'
    }.json`,
    label: 'OSM Topo',
  },
  {
    value:
      'https://raw.githubusercontent.com/nst-guide/fstopo/master/style.json',
    label: 'USFS Topo',
  },
  {
    value: `https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-hybrid${
      webp ? '' : '-png'
    }.json`,
    label: 'Aerial Hybrid',
  },
  {
    value: `https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-aerial${
      webp ? '' : '-png'
    }.json`,
    label: 'Aerial',
  },
];

class Map extends React.Component {
  state = {
    mapStyle: mapStyles[0],
    hoveredObject: null,
    pointerX: null,
    pointerY: null,
  };

  _getInitialViewState(hash) {
    if (!hash || hash.charAt(0) !== '#') {
      return initialViewState;
    }
    // Split the hash into an array of numbers
    const hashArray = hash
      .substring(1)
      .split('/')
      .map(Number);
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

  _renderTooltip() {
    const { hoveredObject, pointerX, pointerY } = this.state || {};
    return (
      hoveredObject && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            left: pointerX,
            top: pointerY,
            width: 400,
            height: 400,
          }}
        >
          <Image
            alt="Gatsby in Space"
            filename={`photos/${hoveredObject.id}.jpeg`}
          />
        </div>
      )
    );
  }

  render() {
    const { mapStyle } = this.state;
    const { location } = this.props;

    const photosLayer = new GeoJsonLayer({
      id: 'photos',
      data: 'https://tiles.nst.guide/photos/index.geojson',
      // Styles
      filled: true,
      stroked: true,
      pointRadiusMinPixels: 5,
      pointRadiusScale: 1,
      getRadius: f => 15,
      getFillColor: [18, 0, 244, 200],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick: () => console.log('clicked'),
      // Update app state
      onHover: info =>
        this.setState({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y,
        }),
    });

    const trailLayer = new GeoJsonLayer({
      id: 'trail',
      data: 'https://tiles.nst.guide/pct/halfmile.geojson',
      getLineWidth: 10,
      filled: false,
      stroked: false,
      pickable: true,
      autoHighlight: true,
      lineWidthMinPixels: 2,
      // Red if main trail; blue if alternate
      getLineColor: f =>
        f.properties.alternate ? [0, 38, 245, 200] : [235, 50, 35, 200],
    });
    const layers = [trailLayer, photosLayer];

    return (
      <div>
        <DeckGL
          key="deckgl"
          ref={ref => {
            this.deckGl = ref;
          }}
          controller
          initialViewState={this._getInitialViewState(location.hash)}
          layers={layers}
          ContextProvider={MapContext.Provider}
        >
          <StaticMap
            key="staticmap"
            ref={ref => {
              this.staticMap = ref && ref.getMap();
            }}
            mapStyle={mapStyle.value}
            mapOptions={{ hash: true }}
          />
          <div style={{ position: 'absolute', right: 30, top: 110, zIndex: 1 }}>
            <NavigationControl />
          </div>
          <div
            style={{
              position: 'absolute',
              width: 150,
              left: 30,
              top: 110,
              zIndex: 1,
            }}
          >
            <Select
              value={mapStyle}
              onChange={choice => {
                this.setState({ mapStyle: choice });
              }}
              options={mapStyles}
            />
          </div>
          {this._renderTooltip()}
        </DeckGL>
      </div>
    );
  }
}

export default Map;
