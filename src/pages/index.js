import React from "react"
import { Link } from "gatsby"
import ReactMapGL from "react-map-gl"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const MAPBOX_TOKEN = process.env.MAPBOX_API_KEY || ""

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <p>Here's a map!</p>
    <Map/>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

class Map extends React.Component {
  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8,
    },
  }

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={viewport => this.setState({ viewport })}
      />
    )
  }
}

export default IndexPage
