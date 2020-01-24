import * as React from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { MapController } from 'deck.gl';
import InteractiveMap, {
  _MapContext as MapContext,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl';
import Select from 'react-select';
import { beforeId, getInitialViewState } from './utils';
import { loadMapStyle, mapStyles } from './mapStyle';
import {
  Accordion,
  Checkbox,
  Container,
  Icon,
  Menu,
  Button,
} from 'semantic-ui-react';
import { DataFilterExtension } from '@deck.gl/extensions';
import { OpacitySlider } from './OpacitySlider';
import { SlopeAngleLegend, AirQualityLegend } from '../Legend';
import {
  NationalParkLayer,
  SlopeAngleLayer,
  PCTTrailLayer,
  interactiveLayerIds,
} from './MapboxLayer';
import {
  CurrentWildfireTooltip,
  NationalParkTooltip,
  PhotoTooltip,
} from '../Tooltip';

// You'll get obscure errors without including the Mapbox GL CSS
import '../../css/mapbox-gl.css';

class Map extends React.Component {
  state = {
    mapStyle: mapStyles[0],
    pickedObject: null,
    pickedLayer: null,
    pointerX: null,
    pointerY: null,
    mapUnitsMetric: false,
    dataOverlaysExpanded: false,
    dataOverlaysExpandedSection: null,
    layerPhotosVisible: true,
    layerPhotosShowAll: false,
    layerAirQualityVisible: false,
    layerAirQualityOpacity: 0.05,
    layerCurrentWildfireVisible: true,
    layerCurrentWildfireOpacity: 0.5,
    layerNationalParksVisible: false,
    layerNationalParksOpacity: 0.3,
    layerSlopeAngleVisible: true,
    layerSlopeAngleOpacity: 0.3,
  };

  _renderTooltip() {
    const { pickedObject, pickedLayer, pointerX, pointerY } = this.state || {};

    if (!pickedObject) return;

    if (pickedObject && pickedLayer && pickedLayer.id === 'photos') {
      return (
        <PhotoTooltip
          object={pickedObject}
          pointerX={pointerX}
          pointerY={pointerY}
        />
      );
    }
    if (pickedObject && pickedLayer && pickedLayer.id === 'nifc_current') {
      return (
        <CurrentWildfireTooltip
          object={pickedObject}
          pointerX={pointerX}
          pointerY={pointerY}
        />
      );
    }
    if (pickedObject && pickedLayer && pickedLayer.id === 'nationalpark_fill') {
      return (
        <NationalParkTooltip
          object={pickedObject}
          pointerX={pointerX}
          pointerY={pointerY}
        />
      );
    }
  }

  // Called on click by deck.gl
  // event.x, event.y are the clicked x and y coordinates in pixels
  // If the deck.gl picking engine finds something, the `object` , `color` and
  // `layer` attributes will be non-null
  _onClick = event => {
    const { x, y, object, layer } = event;

    // If object and layer both exist, then deck.gl found an object, and I
    // won't query for the Mapbox layers underneath
    if (object && layer) {
      return this.setState({
        pickedObject: object,
        pickedLayer: layer,
        pointerX: x,
        pointerY: y,
      });
    }

    // You can pass those coordinates to React Map GL's queryRenderedFeatures
    // to query any desired layers rendered there.
    // Make sure you create the ref on InteractiveMap or StaticMap
    // Without an options parameter, checks all layers rendered by React Map GL
    const hitbox = 10;
    const features = this.map.queryRenderedFeatures([
      [x - hitbox, y - hitbox],
      [x + hitbox, y + hitbox],
    ]);

    // Find the first feature where the layer id is in interactiveLayerIDs
    const pickedFeature = features.find(feature =>
      interactiveLayerIds.includes(feature.layer.id),
    );
    if (pickedFeature) {
      return this.setState({
        pickedObject: pickedFeature,
        pickedLayer: pickedFeature.layer,
        pointerX: x,
        pointerY: y,
      });
    }

    this.setState({
      pickedObject: null,
    });
    return;
  };

  _onChangeOpacity = (e, { name, value }) => {
    this.setState({ [name]: Number(value) });
  };

  _toggleState = name => {
    this.setState(prevState => ({
      [name]: !prevState[name],
    }));
  };

  _toggleMapOptionsExpanded = value => {
    // If currently expanded, close it; else open this section
    this.setState(prevState => ({
      dataOverlaysExpandedSection:
        prevState.dataOverlaysExpandedSection === value ? null : value,
    }));
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
      onClick: this._onClick,
      // Update app state
      onHover: this._onClick,
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
      opacity: this.state.layerAirQualityOpacity,
      getFillColor: f => f.properties.rgb.split(',').map(Number),
      visible: this.state.layerAirQualityVisible,
    });

    const currentWildfire = new GeoJsonLayer({
      id: 'nifc_current',
      data: 'https://tiles.nst.guide/nifc/current.geojson',
      // Styles
      opacity: this.state.layerCurrentWildfireOpacity,
      getFillColor: [148, 17, 0],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick: this._onClick,
      onHover: this._onClick,
      visible: this.state.layerCurrentWildfireVisible,
    });

    const layers = [airQualityLayer, photosLayer, currentWildfire];

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
          initialViewState={getInitialViewState(location)}
          layers={layers}
          ContextProvider={MapContext.Provider}
          onClick={this._onClick}
          onHover={this._onClick}
          pickingRadius={10}
        >
          <InteractiveMap
            ref={ref => {
              this.map = ref && ref.getMap();
            }}
            mapStyle={mapStyle.json ? mapStyle.json : mapStyle.url}
            mapOptions={{ hash: true }}
          >
            <NationalParkLayer
              beforeId={beforeId({
                layerType: 'raster',
                mapStyle: mapStyle.id,
              })}
              opacity={this.state.layerNationalParksOpacity}
              visible={this.state.layerNationalParksVisible}
            />
            <SlopeAngleLayer
              beforeId={beforeId({
                layerType: 'raster',
                mapStyle: mapStyle.id,
              })}
              opacity={this.state.layerSlopeAngleOpacity}
              visible={this.state.layerSlopeAngleVisible}
            />
            <PCTTrailLayer
              beforeId={beforeId({
                layerType: 'vector',
                mapStyle: mapStyle.id,
              })}
            />
            {/* ScaleControl needs to be _inside_ InteractiveMap */}
            <div
              style={{ position: 'absolute', left: 20, bottom: 20, zIndex: 1 }}
            >
              <ScaleControl
                maxWidth={150}
                unit={this.state.mapUnitsMetric ? 'metric' : 'imperial'}
              />
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
            isSearchable={false}
            onChange={choice => {
              loadMapStyle({
                url: choice.url,
                mapUnitsMetric: this.state.mapUnitsMetric,
              }).then(json => {
                choice.json = json;
                this.setState({ mapStyle: choice });
              });
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
          <Accordion as={Menu} vertical fluid styled style={{ maxWidth: 240 }}>
            <Accordion.Title
              active={this.state.dataOverlaysExpanded}
              index={0}
              onClick={() => this._toggleState('dataOverlaysExpanded')}
            >
              <Icon name="dropdown" />
              Map Options
            </Accordion.Title>
            <Accordion.Content active={this.state.dataOverlaysExpanded}>
              <Accordion as={Menu} vertical fluid styled>
                <Menu.Item>
                  <Accordion.Title
                    active={this.state.dataOverlaysExpandedSection === 'photos'}
                    content="Photos"
                    index={0}
                    onClick={() => this._toggleMapOptionsExpanded('photos')}
                  />
                  <Accordion.Content
                    active={this.state.dataOverlaysExpandedSection === 'photos'}
                  >
                    <Checkbox
                      label="Enabled"
                      onChange={() => this._toggleState('layerPhotosVisible')}
                      checked={this.state.layerPhotosVisible}
                      style={{ paddingBottom: 10 }}
                    />
                    <Checkbox
                      label="Show all photos"
                      onChange={() => this._toggleState('layerPhotosShowAll')}
                      checked={this.state.layerPhotosShowAll}
                    />
                  </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                  <Accordion.Title
                    active={
                      this.state.dataOverlaysExpandedSection === 'airquality'
                    }
                    content="Current Air Quality"
                    onClick={() => this._toggleMapOptionsExpanded('airquality')}
                  />
                  <Accordion.Content
                    active={
                      this.state.dataOverlaysExpandedSection === 'airquality'
                    }
                  >
                    <Checkbox
                      label="Enabled"
                      onChange={() =>
                        this._toggleState('layerAirQualityVisible')
                      }
                      checked={this.state.layerAirQualityVisible}
                      style={{ paddingBottom: 10 }}
                    />
                    <OpacitySlider
                      name="layerAirQualityOpacity"
                      value={this.state.layerAirQualityOpacity}
                      onChange={this._onChangeOpacity}
                    />
                    <AirQualityLegend />
                  </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                  <Accordion.Title
                    active={
                      this.state.dataOverlaysExpandedSection ===
                      'currentwildfire'
                    }
                    content="Current Wildfire"
                    onClick={() =>
                      this._toggleMapOptionsExpanded('currentwildfire')
                    }
                  />
                  <Accordion.Content
                    active={
                      this.state.dataOverlaysExpandedSection ===
                      'currentwildfire'
                    }
                  >
                    <Checkbox
                      label="Enabled"
                      onChange={() =>
                        this._toggleState('layerCurrentWildfireVisible')
                      }
                      checked={this.state.layerCurrentWildfireVisible}
                      style={{ paddingBottom: 10 }}
                    />
                    <OpacitySlider
                      name="layerCurrentWildfireOpacity"
                      value={this.state.layerCurrentWildfireOpacity}
                      onChange={this._onChangeOpacity}
                    />
                  </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                  <Accordion.Title
                    active={
                      this.state.dataOverlaysExpandedSection === 'nationalparks'
                    }
                    content="National Parks"
                    onClick={() =>
                      this._toggleMapOptionsExpanded('nationalparks')
                    }
                  />
                  <Accordion.Content
                    active={
                      this.state.dataOverlaysExpandedSection === 'nationalparks'
                    }
                  >
                    <Checkbox
                      label="Enabled"
                      onChange={() =>
                        this._toggleState('layerNationalParksVisible')
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
                    active={
                      this.state.dataOverlaysExpandedSection === 'slopeangle'
                    }
                    content="Slope Angle Shading"
                    onClick={() => this._toggleMapOptionsExpanded('slopeangle')}
                  />
                  <Accordion.Content
                    active={
                      this.state.dataOverlaysExpandedSection === 'slopeangle'
                    }
                  >
                    <Checkbox
                      label="Enabled"
                      onChange={() =>
                        this._toggleState('layerSlopeAngleVisible')
                      }
                      checked={this.state.layerSlopeAngleVisible}
                      style={{
                        paddingBottom: 10,
                      }}
                    />
                    <OpacitySlider
                      name="layerSlopeAngleOpacity"
                      value={this.state.layerSlopeAngleOpacity}
                      onChange={this._onChangeOpacity}
                    />
                    <SlopeAngleLegend />
                  </Accordion.Content>
                </Menu.Item>
                <Menu.Item>
                  <Accordion.Title
                    active={
                      this.state.dataOverlaysExpandedSection === 'mapunits'
                    }
                    content="Map Units"
                    onClick={() => this._toggleMapOptionsExpanded('mapunits')}
                  />
                  <Accordion.Content
                    active={
                      this.state.dataOverlaysExpandedSection === 'mapunits'
                    }
                  >
                    <Button.Group compact>
                      <Button
                        compact
                        toggle
                        active={this.state.mapUnitsMetric}
                        onClick={() => {
                          let mapStyle = this.state.mapStyle;
                          const mapUnitsMetric = true;
                          loadMapStyle({
                            url: mapStyle.url,
                            mapUnitsMetric: mapUnitsMetric,
                          }).then(json => {
                            mapStyle.json = json;
                            console.log(mapStyle);
                            this.setState({
                              mapStyle: mapStyle,
                              mapUnitsMetric: mapUnitsMetric,
                            });
                          });
                        }}
                      >
                        Metric
                      </Button>
                      <Button
                        compact
                        toggle
                        active={!this.state.mapUnitsMetric}
                        onClick={() => {
                          let mapStyle = this.state.mapStyle;
                          const mapUnitsMetric = false;
                          loadMapStyle({
                            url: mapStyle.url,
                            mapUnitsMetric: mapUnitsMetric,
                          }).then(json => {
                            mapStyle.json = json;
                            console.log(mapStyle);
                            this.setState({
                              mapStyle: mapStyle,
                              mapUnitsMetric: mapUnitsMetric,
                            });
                          });
                        }}
                      >
                        Imperial
                      </Button>
                    </Button.Group>
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
