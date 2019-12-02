import * as React from "react";
import DeckGL from "@deck.gl/react";
import { LineLayer } from "@deck.gl/layers";
import {
  _MapContext as MapContext,
  StaticMap,
  NavigationControl,
} from "react-map-gl";
// import tileLayer from "./TileLayer";

// Initial viewport settings
const initialViewState = {
  bearing: 0,
  latitude: 37.8759,
  longitude: -119.3629,
  pitch: 0,
  zoom: 8,
};

const mapStyle =
  "https://raw.githubusercontent.com/nst-guide/osm-liberty/gh-pages/style.json";

// Data to be used by the LineLayer
const data = [
  {
    sourcePosition: [-122.41669, 37.7853],
    targetPosition: [-122.41669, 37.781],
  },
];

class Map extends React.Component {
  render() {
    // const layers = [
    //   new LineLayer({ id: "line-layer", data }),
    //   new tileLayer({}),
    // ];

    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        // layers={layers}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
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
