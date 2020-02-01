import * as React from 'react';
import { Source, Layer } from 'react-map-gl';

// List of Mapbox/React Map GL layer ids that are allowed to be picked
// These will be picked if no deck.gl layer is above it.
export const interactiveLayerIds = [
  // React map gl layers:
  'nationalpark_fill',
  'nationalforest_fill',
  'wildfire_historical_fill',
  'wilderness_fill',
  'transit_routes',
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
          'fill-color': 'hsl(30, 50%, 30%)',
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
      <Layer
        id="nationalpark_outline"
        beforeId={beforeId}
        type="line"
        source-layer="nationalparks"
        paint={{
          'line-opacity': Math.min(opacity + 0.1, 1),
          'line-color': 'hsl(30, 50%, 0%)',
          'line-width': 1,
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
      <Layer
        id="nationalpark_label"
        beforeId={beforeId}
        type="symbol"
        source-layer="nationalparks_label"
        paint={{
          'text-color': '#334',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(255,255,255,0.8)',
          'text-halo-width': {
            stops: [
              [6, 1],
              [14, 0.5],
            ],
          },
        }}
        layout={{
          'text-field': '{fullName}',
          'text-font': ['Open Sans Italic'],
          'text-max-width': 6.25,
          'text-size': {
            stops: [
              [6, 10],
              [14, 17],
            ],
          },
          'text-transform': 'none',
          visibility: visible ? 'visible' : 'none',
        }}
      />
    </Source>
  );
}

export function WildernessLayer(props) {
  const { beforeId, opacity, visible } = props;
  return (
    <Source
      id="wilderness"
      type="vector"
      url="https://tiles.nst.guide/pct/wilderness/tile.json"
    >
      <Layer
        id="wilderness_fill"
        beforeId={beforeId}
        type="fill"
        source-layer="wilderness"
        paint={{
          'fill-opacity': opacity,
          'fill-color': 'hsl(85, 100%, 25%)',
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
      <Layer
        id="wilderness_outline"
        beforeId={beforeId}
        type="line"
        source-layer="wilderness"
        paint={{
          'line-opacity': Math.min(opacity + 0.1, 1),
          'line-color': 'hsl(85, 100%, 15%)',
          'line-width': 1,
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
      <Layer
        id="wilderness_label"
        beforeId={beforeId}
        type="symbol"
        source-layer="wilderness_label"
        paint={{
          'text-color': '#334',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(255,255,255,0.8)',
          'text-halo-width': {
            stops: [
              [6, 1],
              [14, 0.5],
            ],
          },
        }}
        layout={{
          'text-field': '{name}',
          'text-font': ['Open Sans Italic'],
          'text-max-width': 6.25,
          'text-size': {
            stops: [
              [6, 10],
              [14, 17],
            ],
          },
          'text-transform': 'none',
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
          'line-opacity': Math.min(opacity + 0.1, 1),
          'line-color': 'hsl(59, 100%, 0%)',
          'line-width': 1,
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
      <Layer
        id="nationalforest_label"
        beforeId={beforeId}
        type="symbol"
        source-layer="nationalforests_label"
        paint={{
          'text-color': '#334',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(255,255,255,0.8)',
          'text-halo-width': {
            stops: [
              [6, 1],
              [14, 0.5],
            ],
          },
        }}
        layout={{
          'text-field': '{forestname}',
          'text-font': ['Open Sans Italic'],
          'text-max-width': 6.25,
          'text-size': {
            stops: [
              [6, 10],
              [14, 17],
            ],
          },
          'text-transform': 'none',
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
      <Layer
        id="wildfire_historical_label"
        beforeId={beforeId}
        type="symbol"
        source-layer="wildfire_historical_label"
        paint={{
          'text-color': '#334',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(255,255,255,0.8)',
          'text-halo-width': {
            stops: [
              [6, 1],
              [14, 0.5],
            ],
          },
        }}
        layout={{
          'text-field': '{name} Fire',
          'text-font': ['Open Sans Italic'],
          'text-max-width': 6.25,
          'text-size': {
            stops: [
              [9, 12],
              [14, 17],
            ],
          },
          'text-transform': 'none',
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

export function TransitLayer(props) {
  const { beforeId, visible, showTownTransit } = props;

  // const filter = showTownTransit
  //   ? ["==", 'true', 'true']
  //   : [
  //       'any',
  //       [
  //         ['!has', '_town'],
  //         ['!=', ['get', '_town'], 1],
  //       ],
  //     ];

  return (
    <Source
      id="transit"
      type="vector"
      url="https://tiles.nst.guide/pct/transit/tile.json"
    >
      <Layer
        id="transit_routes_casing"
        beforeId={beforeId}
        source-layer="routes"
        type="line"
        // filter={filter}
        paint={{
          'line-color': '#000',
          'line-width': 0.6,
          'line-gap-width': 1.6,
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
      <Layer
        id="transit_routes"
        beforeId={beforeId}
        source-layer="routes"
        type="line"
        // filter={filter}
        paint={{
          'line-color': ['concat', '#', ['get', 'color']],
          'line-width': 2,
        }}
        layout={{
          visibility: visible ? 'visible' : 'none',
        }}
      />
      <Layer
        id="transit_stops"
        source-layer="stops"
        type="symbol"
        paint={{
          'text-color': '#4898ff',
          'text-halo-blur': 0.5,
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        }}
        layout={{
          'icon-image': 'bus_11',
          'text-anchor': 'left',
          'text-font': ['Open Sans Italic'],
          'text-max-width': 9,
          'text-offset': [0.9, 0],
          'text-size': {
            base: 1,
            stops: [
              [10, 8],
              [14, 10],
            ],
          },
          visibility: visible ? 'visible' : 'none',
        }}
      />

      <Layer
        id="transit_routes_label"
        source-layer="routes"
        type="symbol"
        // filter={filter}
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
          visibility: visible ? 'visible' : 'none',
        }}
        paint={{
          'text-color': 'rgba(30, 30, 30, 1)',
          'text-halo-blur': 0.5,
          'text-halo-width': 2,
          'text-halo-color': 'rgba(255, 255, 255, 1)',
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
