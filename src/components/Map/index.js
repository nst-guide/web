import * as React from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { MapController } from 'deck.gl';
import InteractiveMap, {
  _MapContext as MapContext,
  NavigationControl,
  ScaleControl,
  Source,
  Layer,
} from 'react-map-gl';
import Image from '../Image';
import Select from 'react-select';
import { canUseWebP, beforeId } from './utils';
import { navigate } from 'gatsby';
import { Accordion, Checkbox, Container, Icon, Menu } from 'semantic-ui-react';
import { DataFilterExtension } from '@deck.gl/extensions';
import { OpacitySlider } from './OpacitySlider';

// You'll get obscure errors without including the Mapbox GL CSS
import '../../css/mapbox-gl.css';

// Default initial viewport settings
// These are overwritten by the URL hash if it exists
const initialViewState = {
  bearing: 0,
  latitude: 37.8759,
  longitude: -119.3629,
  pitch: 0,
  zoom: 8,
};

const webp = canUseWebP();

const mapStyles = [
  {
    value: `https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style${
      webp ? '' : '-png'
    }.json`,
    label: 'OSM Topo',
  },
  {
    value: `https://raw.githubusercontent.com/nst-guide/osm-liberty-topo/gh-pages/style-fstopo${
      webp ? '' : '-png'
    }.json`,
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
    dataOverlaysExpanded: false,
    dataOverlaysPhotosExpanded: false,
    dataOverlaysAirQualityExpanded: false,
    dataOverlaysNationalParksExpanded: false,
    dataOverlaysSlopeAngleExpanded: false,
    layerPhotosVisible: true,
    layerPhotosShowAll: false,
    layerAirQualityVisible: true,
    layerAirQualityOpacity: 0.05,
    layerNationalParksVisible: true,
    layerNationalParksOpacity: 0.3,
    layerSlopeAngleVisible: true,
    layerSlopeAngleOpacity: 0.3,
  };

  // Parse hash from url
  // By default, if no hash or hash is invalid, returns initialViewState
  _getInitialViewState(location) {
    const hash = location.hash;
    if (!hash || hash.charAt(0) !== '#') {
      return initialViewState;
    }
    // Split the hash into an array of numbers
    const hashArray = hash
      .substring(1)
      .split('/')
      .map(Number);

    // If hash is not all Numbers, navigate to current page without hash
    // Note that it's not enough to just return initialViewState because the
    // Mapbox GL JS `hash` option is enabled. If you just return
    // initialViewState, MapboxGL JS will get confused.
    if (hashArray.some(Number.isNaN)) {
      navigate(location.pathname);
      return;
    }

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
            zIndex: 3,
            pointerEvents: 'none',
            left:
              pointerX <= window.innerWidth / 2
                ? Math.min(window.innerWidth * 0.3, pointerX)
                : null,
            right:
              pointerX > window.innerWidth / 2
                ? Math.min(
                    window.innerWidth * 0.3,
                    window.innerWidth - pointerX,
                  )
                : null,
            top:
              pointerY <= window.innerHeight / 2
                ? Math.min(window.innerHeight * 0.5, pointerY)
                : null,
            bottom:
              pointerY > window.innerHeight / 2
                ? Math.min(
                    window.innerHeight * 0.5,
                    window.innerHeight - pointerY,
                  )
                : null,
            width: '70%',
            maxWidth: '600px',
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

  _onClick = event => {
    // event.x and event.y hold the clicked x and y coordinates in pixels
    // You can pass those coordinates to React Map GL's queryRenderedFeatures
    // to query any desired layers rendered there.
    // Make sure you create the ref on InteractiveMap or StaticMap
    // Without an options parameter, checks all layers rendered by React Map GL
    const features = this.map.queryRenderedFeatures([event.x, event.y]);
    console.log(features);
  };

  _onChangeOpacity = (e, { name, value }) => {
    this.setState({ [name]: Number(value) });
  };

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
      onClick: info =>
        this.setState({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y,
        }),
      // Update app state
      onHover: info =>
        this.setState({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y,
        }),
      // Visiblility based on state
      visible: this.state.layerPhotosVisible,

      // Mutate f.properties.favorite to Number so that DataFilter can be used
      dataTransform: data => {
        data.features = data.features.map(f => {
          f.properties.favorite = Number(f.properties.favorite);
          return f;
        });
        return data;
      },

      // Define extensions
      extensions: [new DataFilterExtension({ filterSize: 1 })],

      // props added by DataFilterExtension
      getFilterValue: f => f.properties.favorite,
      filterRange: this.state.layerPhotosShowAll ? [0, 1] : [1, 1],
    });

    const airQualityLayer = new GeoJsonLayer({
      id: 'aqi_pm25',
      data: 'https://tiles.nst.guide/airnow/PM25.geojson',
      // Styles
      pickable: true,
      opacity: this.state.layerAirQualityOpacity,
      getFillColor: f => f.properties.rgb.split(',').map(Number),
      onClick: f => console.log(f),
      onHover: () => console.log('hovered'),
      // Visiblility based on state
      visible: this.state.layerAirQualityVisible,
    });

    const layers = [airQualityLayer, photosLayer];

    return (
      <div ref={ref => (this.deckDiv = ref)}>
        <DeckGL
          ref={ref => {
            this.deck = ref;
          }}
          controller={{
            type: MapController,
            touchRotate: true,
          }}
          initialViewState={this._getInitialViewState(location)}
          layers={layers}
          ContextProvider={MapContext.Provider}
          onClick={this._onClick}
        >
          <InteractiveMap
            ref={ref => {
              this.map = ref && ref.getMap();
            }}
            mapStyle={mapStyle.value}
            mapOptions={{ hash: true }}
          >
            <Source
              id="nationalpark"
              type="vector"
              url="https://tiles.nst.guide/nationalpark/tile.json"
            >
              <Layer
                id="nationalpark_fill"
                beforeId={beforeId({
                  layerType: 'raster',
                  mapStyle: mapStyle.value,
                })}
                type="fill"
                source-layer="nationalpark"
                paint={{
                  'fill-opacity': this.state.layerNationalParksOpacity,
                  'fill-color': 'rgb(115, 77, 38)',
                }}
                layout={{
                  visibility: this.state.layerNationalParksVisible
                    ? 'visible'
                    : 'none',
                }}
              />
            </Source>

            <Source
              id="slope-angle"
              type="raster"
              url="https://tiles.nst.guide/slope-angle-png/tile.json"
            >
              <Layer
                id="slope-angle-raster"
                beforeId={beforeId({
                  layerType: 'raster',
                  mapStyle: mapStyle.value,
                })}
                type="raster"
                paint={{
                  'raster-opacity': this.state.layerSlopeAngleOpacity,
                }}
                layout={{
                  visibility: this.state.layerSlopeAngleVisible
                    ? 'visible'
                    : 'none',
                }}
              />
            </Source>

            <Source
              id="hmline"
              type="vector"
              url="https://tiles.nst.guide/pct/hmline/tile.json"
              maxzoom={11}
            >
              <Layer
                id="hmline_line_pct"
                beforeId={beforeId({
                  layerType: 'vector',
                  mapStyle: mapStyle.value,
                })}
                source-layer="hmline"
                type="line"
                filter={['==', 'alternate', false]}
                paint={{
                  'line-color': 'rgb(235, 50, 35)',
                }}
              />
              <Layer
                id="hmline_line_al"
                beforeId={beforeId({
                  layerType: 'vector',
                  mapStyle: mapStyle.value,
                })}
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
            {/* ScaleControl needs to be _inside_ InteractiveMap */}
            <div
              style={{ position: 'absolute', left: 20, bottom: 20, zIndex: 1 }}
            >
              <ScaleControl maxWidth={150} unit="imperial" />
            </div>
          </InteractiveMap>

          {/* NavigationControl needs to be _outside_ InteractiveMap */}
          <div style={{ position: 'absolute', right: 30, top: 110, zIndex: 1 }}>
            <NavigationControl />
          </div>
        </DeckGL>
        <div
          style={{
            position: 'absolute',
            width: 150,
            left: 30,
            top: 110,
            zIndex: 2,
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

        <Container
          style={{
            position: 'absolute',
            width: 240,
            left: 30,
            top: 160,
            zIndex: 1,
            backgroundColor: '#fff',
          }}
        >
          <Accordion as={Menu} vertical fluid styled>
            <Accordion.Title
              active={this.state.dataOverlaysExpanded}
              index={0}
              onClick={() =>
                this.setState(prevState => ({
                  dataOverlaysExpanded: !prevState.dataOverlaysExpanded,
                }))
              }
            >
              <Icon name="dropdown" />
              Data Overlays
            </Accordion.Title>
            <Accordion.Content active={this.state.dataOverlaysExpanded}>
              <Accordion as={Menu} vertical fluid styled>
                <Menu.Item>
                  <Accordion.Title
                    active={this.state.dataOverlaysPhotosExpanded}
                    content="Photos"
                    index={0}
                    onClick={() =>
                      this.setState(prevState => ({
                        dataOverlaysPhotosExpanded: !prevState.dataOverlaysPhotosExpanded,
                      }))
                    }
                  />
                  <Accordion.Content
                    active={this.state.dataOverlaysPhotosExpanded}
                  >
                    <Checkbox
                      label="Enabled"
                      onChange={() =>
                        this.setState(prevState => ({
                          layerPhotosVisible: !prevState.layerPhotosVisible,
                        }))
                      }
                      checked={this.state.layerPhotosVisible}
                      style={{ paddingBottom: 10 }}
                    />
                    <Checkbox
                      label="Show all photos"
                      onChange={() =>
                        this.setState(prevState => ({
                          layerPhotosShowAll: !prevState.layerPhotosShowAll,
                        }))
                      }
                      checked={this.state.layerPhotosShowAll}
                    />
                  </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                  <Accordion.Title
                    active={this.state.dataOverlaysAirQualityExpanded}
                    content="Current Air Quality"
                    onClick={() =>
                      this.setState(prevState => ({
                        dataOverlaysAirQualityExpanded: !prevState.dataOverlaysAirQualityExpanded,
                      }))
                    }
                  />
                  <Accordion.Content
                    active={this.state.dataOverlaysAirQualityExpanded}
                  >
                    <Checkbox
                      label="Enabled"
                      onChange={() =>
                        this.setState(prevState => ({
                          layerAirQualityVisible: !prevState.layerAirQualityVisible,
                        }))
                      }
                      checked={this.state.layerAirQualityVisible}
                      style={{ paddingBottom: 10 }}
                    />
                    <OpacitySlider
                      name="layerAirQualityOpacity"
                      value={this.state.layerAirQualityOpacity}
                      onChange={this._onChangeOpacity}
                    />
                  </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                  <Accordion.Title
                    active={this.state.dataOverlaysNationalParksExpanded}
                    content="National Parks"
                    onClick={() =>
                      this.setState(prevState => ({
                        dataOverlaysNationalParksExpanded: !prevState.dataOverlaysNationalParksExpanded,
                      }))
                    }
                  />
                  <Accordion.Content
                    active={this.state.dataOverlaysNationalParksExpanded}
                  >
                    <Checkbox
                      label="Enabled"
                      onChange={() =>
                        this.setState(prevState => ({
                          layerNationalParksVisible: !prevState.layerNationalParksVisible,
                        }))
                      }
                      checked={this.state.layerNationalParksVisible}
                      style={{ paddingBottom: 10 }}
                    />
                    <OpacitySlider
                      name="layerNationalParksOpacity"
                      value={this.state.layerNationalParksOpacity}
                      onChange={this._onChangeOpacity}
                    />
                  </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                  <Accordion.Title
                    active={this.state.dataOverlaysSlopeAngleExpanded}
                    content="Slope Angle Shading"
                    onClick={() =>
                      this.setState(prevState => ({
                        dataOverlaysSlopeAngleExpanded: !prevState.dataOverlaysSlopeAngleExpanded,
                      }))
                    }
                  />
                  <Accordion.Content
                    active={this.state.dataOverlaysSlopeAngleExpanded}
                  >
                    <Checkbox
                      label="Slope Angle Shading"
                      onChange={() =>
                        this.setState(prevState => ({
                          layerSlopeAngleVisible: !prevState.layerSlopeAngleVisible,
                        }))
                      }
                      checked={this.state.layerSlopeAngleVisible}
                      style={{ paddingBottom: 10 }}
                    />
                    <OpacitySlider
                      name="layerSlopeAngleOpacity"
                      value={this.state.layerSlopeAngleOpacity}
                      onChange={this._onChangeOpacity}
                    />
                  </Accordion.Content>
                </Menu.Item>
              </Accordion>
            </Accordion.Content>
          </Accordion>
        </Container>

        {this._renderTooltip()}
      </div>
    );
  }
}

export default Map;
