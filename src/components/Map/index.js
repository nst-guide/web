import * as React from 'react';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {
  _MapContext as MapContext,
  StaticMap,
  NavigationControl,
  FullscreenControl,
  Marker,
  Source,
  Layer
} from 'react-map-gl';
import uuidv4 from 'uuid/v4';
import tileLayer from './TileLayer';

// Initial viewport settings
const initialViewState = {
  bearing: 0,
  latitude: 37.8759,
  longitude: -119.3629,
  pitch: 0,
  zoom: 8
};

const mapStyle =
  'https://raw.githubusercontent.com/nst-guide/osm-liberty/gh-pages/style.json';

// Data to be used by the LineLayer
const data = [
  {
    sourcePosition: [-122.41669, 37.7853],
    targetPosition: [-122.41669, 37.781]
  }
];

class Map extends React.Component {
  render() {
    // Const layers = [
    //   new LineLayer({ id: "line-layer", data }),
    //   new tileLayer({}),
    // ];

    return (
      <DeckGL
        controller
        initialViewState={initialViewState}
        // Layers={layers}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap key="staticmap" touchRotate mapStyle={mapStyle}>
          {/* <Source
            key="nationalpark"
            id="nationalpark"
            type="vector"
            onHover={() => console.log('hello world')}
            url="https://tiles.nst.guide/nationalpark/tile.json"
          >
            <Layer
              key="nationalpark_fill"
              id="nationalpark_fill"
              type="fill"
              source-layer="nationalpark"
              visibility="none"
              paint={{
                'fill-opacity': 1,
                'fill-color': '#d8e8c8',
              }}
            />
          </Source> */}
        </StaticMap>
        <div style={{position: 'absolute', right: 30, top: 120, zIndex: 1}}>
          <NavigationControl/>
        </div>
      </DeckGL>
    );
  }
}

export default Map;
