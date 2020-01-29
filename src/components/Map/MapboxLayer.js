import * as React from 'react';
import { Source, Layer } from 'react-map-gl';

// List of Mapbox/React Map GL layer ids that are allowed to be picked
// These will be picked if no deck.gl layer is above it.
export const interactiveLayerIds = [
  // React map gl layers:
  'nationalpark_fill',
  'nationalforest_fill',
  'wildfire_historical_fill',
  // Basemap layers:
];

export function NationalParkLayer(props) {
  const { beforeId, opacity, visible } = props;
  return (
    <Source
      id="nationalpark"
      type="vector"
      url="https://tiles.nst.guide/nationalpark/tile.json"
    >
      <Layer
        id="nationalpark_fill"
        beforeId={beforeId}
        type="fill"
        source-layer="nationalparks"
        paint={{
          'fill-opacity': opacity,
          'fill-color': 'rgb(115, 77, 38)',
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
    </Source>
  );
}

export function NationalForestLayer(props) {
  const { beforeId, opacity, visible } = props;
  return (
    <Source
      id="nationalforest"
      type="vector"
      url="https://tiles.nst.guide/pct/nationalforest/tile.json"
    >
      <Layer
        id="nationalforest_fill"
        beforeId={beforeId}
        type="fill"
        source-layer="nationalforests"
        paint={{
          'fill-opacity': opacity,
          'fill-color': 'hsl(59, 100%, 40%)',
          // 'fill-outline-color': 'hsl(59, 100%, 0%)',
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
      <Layer
        id="nationalforest_outline"
        beforeId={beforeId}
        type="line"
        source-layer="nationalforests"
        paint={{
          'line-opacity': Math.min(opacity + .1, 1),
          'line-color': 'hsl(59, 100%, 0%)',
          'line-width': 1,
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
    </Source>
  );
}

export function HistoricalWildfireLayer(props) {
  const { beforeId, opacity, visible } = props;
  return (
    <Source
      id="wildfire_historical"
      type="vector"
      url="https://tiles.nst.guide/pct/wildfire_historical/tile.json"
    >
      <Layer
        id="wildfire_historical_fill"
        beforeId={beforeId}
        type="fill"
        source-layer="wildfire_historical"
        paint={{
          'fill-opacity': opacity,
          'fill-color': 'hsl(7, 100%, 30%)',
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
      <Layer
        id="wildfire_historical_outline"
        beforeId={beforeId}
        type="line"
        source-layer="wildfire_historical"
        paint={{
          'line-opacity': Math.min(opacity + 0.1, 1),
          'line-color': 'hsl(7, 100%, 30%)',
          'line-width': 1,
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
    </Source>
  );
}

export function SlopeAngleLayer(props) {
  const { beforeId, opacity, visible } = props;
  return (
    <Source
      id="slope-angle"
      type="raster"
      url="https://tiles.nst.guide/slope-angle-png/tile.json"
    >
      <Layer
        id="slope-angle-raster"
        beforeId={beforeId}
        type="raster"
        paint={{
          'raster-opacity': opacity,
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
    </Source>
  );
}

export function PCTTrailLayer(props) {
  const { beforeId } = props;
  return (
    <Source
      id="hmline"
      type="vector"
      url="https://tiles.nst.guide/pct/hmline/tile.json"
      maxzoom={11}
    >
      <Layer
        id="hmline_line_pct"
        beforeId={beforeId}
        source-layer="hmline"
        type="line"
        filter={['==', 'alternate', false]}
        paint={{
          'line-color': 'rgb(235, 50, 35)',
        }}
      />
      <Layer
        id="hmline_line_alt"
        beforeId={beforeId}
        source-layer="hmline"
        type="line"
        filter={['==', 'alternate', true]}
        paint={{
          'line-color': 'rgb(0, 38, 245)',
        }}
      />
      <Layer
        id="hmline_label"
        source-layer="hmline"
        type="symbol"
        layout={{
          'symbol-placement': 'line',
          'text-anchor': 'center',
          'text-field': '{name}',
          'text-font': ['Open Sans Regular'],
          'text-offset': [1, 0],
          'text-size': {
            base: 1,
            stops: [
              [5, 10],
              [14, 13],
            ],
          },
          'symbol-spacing': 350,
          'text-max-angle': 50,
          'text-letter-spacing': 0,
          'text-max-width': 15,
          'text-allow-overlap': true,
        }}
        paint={{
          'text-color': 'rgba(30, 30, 30, 1)',
          'text-halo-blur': 0.5,
          'text-halo-width': 1.5,
          'text-halo-color': 'rgba(255, 255, 255, 1)',
        }}
      />
    </Source>
  );
}
