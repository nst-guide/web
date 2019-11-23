import { TileLayer } from "@deck.gl/geo-layers";
import { VectorTile } from "@mapbox/vector-tile";
import Protobuf from "pbf";
import bboxClip from "@turf/bbox-clip";
import { values, map, flatMap, range } from "lodash";

const tileLayer = (attrs) => {
  const args = { ...defaultArgs, ...attrs };
  return new TileLayer(args);
};

const defaultArgs = {
  pickable: true,
  stroked: false,

  getLineColor: (f) =>
    f.geometry.type === "LineString" ? [0, 128, 239] : [0, 0, 0, 0],

  // getLineColor: [0, 0, 0],
  getFillColor: [77, 77, 77],

  opacity: 0.2,

  maxZoom: 11,

  getLineWidth: () => {
    return 1;
  },
  lineWidthMinPixels: 1,

  getTileData: ({ x, y, z, bbox }) => {
    const mapSource = `https://tiles.nst.guide/nationalpark/${z}/${x}/${y}.pbf`;
    const xyzBox = [bbox.west, bbox.south, bbox.east, bbox.north];
    return fetch(mapSource)
      .then((response) => {
        if (response.status === 200) {
          return response.arrayBuffer();
        }
        return null;
      })
      .then((buffer) => {
        if (buffer) {
          const tile = new VectorTile(new Protobuf(buffer));
          return values(tile.layers).flatMap((vectorTileLayer) => {
            return range(vectorTileLayer.length).map((i) => {
              const vectorTileFeature = vectorTileLayer.feature(i);
              const feature = vectorTileFeature.toGeoJSON(x, y, z);
              // clip to x, y, z box
              const clippedFeature = bboxClip(feature, xyzBox);
              return clippedFeature;
            });
          });
        }
        return [];
      });
  },

  onClick: ({ object }) => {
    console.log("hover object.properties", object && object.properties);
  },
};

export default tileLayer;
