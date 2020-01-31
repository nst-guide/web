# National Scenic Trails Guide: Web

Website: <https://nst.guide>

Open source website for exploring National Scenic Trails, starting with the
Pacific Crest Trail.

## Overview

### Map Rendering

This uses [Deck.gl](https://deck.gl/) and [React Map
GL](https://uber.github.io/react-map-gl/) to render the map. React Map GL is
essentially a wrapper around the base Mapbox-GL-JS to allow it to work well with
React. Deck.gl is a set of extensions on React Map GL to render cool geospatial
visualizations with Web GL. Note that here there are two separate rendering
layers: Deck.gl and React Map GL have no knowledge of what the other is
displaying. The only tie between them is Deck.gl keeping track of the map
location state.

Using both Deck.gl and React Map GL allows me to use the best features of each.
Deck.gl enables cool 3D stuff, including hopefully [3D terrain
visualizations](https://github.com/uber/deck.gl/pull/3984) in the near future.
However Deck.gl doesn't render vector tiles as nicely as Mapbox does. Rendering
vector tiles with Mapbox allows me to get the benefits of their smaller file
sizes while also easily inserting new layers in between the existing style
stack, so that I can insert new layers _underneath_ existing labels.

Because I use each program for rendering, I need to be able to pick objects from
each source. I currently first call Deck.gl, and if it finds any objects under
the cursor return those. If not, send the x, y position of the cursor to React
Map GL/Mapbox GL and run `queryRenderedFeatures` to find the object rendered at
that position with the Mapbox rendering.

### Map Layers

I generate map layers from several different sources using code in the
[nst-guide/data](https://github.com/nst-guide/data) repository. Check out that
repository or its [documentation website](https://nst-guide.github.io/data/) for
more information about how I generate the data for each layer.

### Map Style

This project is an intermediate step in hopefully developing a free, open source
navigation app for the Pacific Crest Trail built on React Native. In order to
support free offline maps without needing to worry about API fees, I generated
my own vector topographic maps using OpenStreetMap data, USGS elevation data for
the contours and Terrain RGB tiles, and USDA National Agriculture Imagery
Program (NAIP) data for the aerial tiles.

More information about the map style and how to generate your own data is
available on the style repository:
[nst-guide/osm-liberty-topo](https://github.com/nst-guide/osm-liberty-topo).

## Developing

This website is made with React, GatsbyJS, Deck.gl, and React Map GL. I use
Semantic UI React for the UI.

If you're interested in contributing to the project, check out the [backlog of
issues](https://github.com/nst-guide/web/issues), or just read through the code
and tell me [in an issue](https://github.com/nst-guide/web/issues/new) how to
improve it! I'm relatively new at front-end development, so there's _a lot_ that
could be improved!

To get started, assuming you have the Gatsby CLI installed:

```bash
git clone https://github.com/nst-guide/web
npm install
gatsby develop
```

### NPM Scripts

- `npm install` to install dependencies
- `gatsby develop` to run a hot-reloading development server
- `npm run build` to build the project and save locally
- `npm run deploy` to build the project and upload to S3 (which I use for hosting)

