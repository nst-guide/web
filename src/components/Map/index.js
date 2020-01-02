import * as React from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import {
  _MapContext as MapContext,
  StaticMap,
  NavigationControl,
} from 'react-map-gl';
import tileLayer from './TileLayer';

// Initial viewport settings
const initialViewState = {
  bearing: 0,
  latitude: 37.8759,
  longitude: -119.3629,
  pitch: 0,
  zoom: 8,
};

const mapStyle =
  'https://raw.githubusercontent.com/nst-guide/osm-liberty/gh-pages/style.json';

class Map extends React.Component {
  state = {
    photosData: null,
    viewNationalPark: true,
    hoveredFeatures: null,
  };

  render() {
    const geojsonLayer = new GeoJsonLayer({
      id: 'airports',
      data: 'https://tiles.nst.guide/photos/index.geojson',
      // Styles
      filled: true,
      stroked: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 1,
      getRadius: f => 10,
      getFillColor: [200, 0, 80, 180],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick: () => console.log('clicked'),
    });

    const layers = [geojsonLayer];

    return (
      <DeckGL
        key="deckgl"
        ref={ref => {
          this.deckGl = ref;
        }}
        controller
        initialViewState={initialViewState}
        layers={layers}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          key="staticmap"
          ref={ref => {
            this.staticMap = ref && ref.getMap();
          }}
          mapStyle={mapStyle}
        />
        <div style={{ position: 'absolute', right: 30, top: 120, zIndex: 1 }}>
          <NavigationControl />
        </div>
      </DeckGL>
    );
  }
}

export default Map;
