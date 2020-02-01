import * as React from "react";
import {
  Header,
  Container,
  List,
  Segment,
  Icon,
  Grid,
} from "semantic-ui-react";
import { withLayout } from "../components/Layout";
import Image from "../components/Image";

const repositories = [
  {
    repoName: "web",
    desc: "This website",
  },
  {
    repoName: "data",
    desc: "Generate map overlays from open data sources",
  },
  {
    repoName: "osm-liberty-topo",
    desc: "The topographic map style used in this website",
  },
  {
    repoName: "openmaptiles",
    desc: "Generate map data from OpenStreetMap",
  },
  {
    repoName: "terrain",
    desc: "Generate contours and hillshading tiles from USGS data",
  },
  {
    repoName: "fstopo",
    desc: "Generate raster map tiles from USFS Topo quadrangles",
  },
  {
    repoName: "naip",
    desc: "Generate aerial imagery map tiles from USGS NAIP data",
  },
  {
    repoName: "openmaptiles",
    desc: "Generate map data from OpenStreetMap",
  },
];

const RepositoriesList = (props) => {
  const { items } = props;

  return (
    <List divided relaxed>
      {items.map((item) => (
        <List.Item>
          <List.Icon name="github" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header
              href={`https://github.com/nst-guide/${item.repoName}`}
              target="_blank"
              as="a"
            >
              {`nst-guide/${item.repoName}`}
            </List.Header>
            <List.Description as="p">{item.desc}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

const AboutPage = () => {
  return (
    <Container>
      <Segment vertical>
        <Header as="h2">
          <Icon name="info circle" />
          <Header.Content>About</Header.Content>
        </Header>
      </Segment>
      <Segment vertical>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Header as="h3">Welcome!</Header>
              <p>
                I thru-hiked the Pacific Crest Trail in
                2019 and had an amazing time out there.
              </p>
              <p>
                While on the trail I decided to pursue a career as a software
                engineer working on maps. Since I don't have a background in
                software engineering, I decided to devote a few months after
                the trail to self-study and to attempt to create a website and
                mobile app for the trail.
              </p>
              <p>
                Nearly all the data for this project is created in an automated
                fashion, to leave open the possibility to expand this website to
                more National Scenic Trails in the future. If you're interested
                in helping to update this for another trail, create an issue on
                Github or
                <a href="mailto:kylebarron2@gmail.com"> shoot me an email.</a>
              </p>
              <p>
                If you're interested in seeing how this website works, the
                entire codebase for the project is open source, split into a few
                separate repositories on Github:
              </p>
              <RepositoriesList items={repositories} />
            </Grid.Column>
            <Grid.Column>
              <Image alt="Image of me!" filename="photos/IMG_2298.jpeg" />
              <div style={{ textAlign: "center" }}>
                <p>Kyle "Stats" Barron</p>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  );
};

export default withLayout(AboutPage);
