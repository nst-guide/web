import * as React from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import {
  _MapContext as MapContext,
  StaticMap,
  NavigationControl,
} from 'react-map-gl';
import Image from '../Image';

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
    hoveredObject: null,
    pointerX: null,
    pointerY: null,
  };

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
    const geojsonLayer = new GeoJsonLayer({
      id: 'photos',
      data: 'https://tiles.nst.guide/photos/index.geojson',
      // Styles
      filled: true,
      stroked: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 1,
      getRadius: f => 100,
      getFillColor: [200, 0, 80, 180],
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

    const layers = [geojsonLayer];

    return (
      <div>
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
          {this._renderTooltip()}
        </DeckGL>
      </div>
    );
  }
}

export default Map;
