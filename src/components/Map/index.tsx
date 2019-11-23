import * as React from "react";
import DeckGL from "@deck.gl/react";
import { LineLayer } from "@deck.gl/layers";
import {
  _MapContext as MapContext,
  StaticMap,
  NavigationControl,
} from "react-map-gl";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_API_KEY;

// Initial viewport settings
const initialViewState = {
  bearing: 0,
  latitude: 37.7853,
  longitude: -122.41669,
  pitch: 0,
  zoom: 13,
};

const mapStyle = "mapbox://styles/mapbox/outdoors-v11";

// Data to be used by the LineLayer
const data = [
  {
    sourcePosition: [-122.41669, 37.7853],
    targetPosition: [-122.41669, 37.781],
  },
];

class Map extends React.Component {
  render() {
    const layers = [new LineLayer({ id: "line-layer", data })];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle={mapStyle}
        />
        <div style={{ position: "absolute", right: 30, top: 120, zIndex: 1 }}>
          <NavigationControl />
        </div>
      </DeckGL>
    );
  }
}

export default Map;
