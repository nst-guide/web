import * as React from 'react';
import {
  Card,
  Accordion,
  Label,
  Icon,
  Grid,
  Dimmer,
  Loader,
  Image as SemanticImage,
} from 'semantic-ui-react';
import Image from '../Image';

function TooltipPin(props) {
  const { onClick = null } = props;
  return <Label corner="right" icon="x" color="black" onClick={onClick} />;
}

function TooltipDiv(props) {
  const {
    x,
    y,
    width = '70%',
    maxWidth = '600px',
    maxHeight = '60%',
    pinned = false,
  } = props;

  // Setting pointerEvents based on the state of `pinned` is necessary because
  // otherwise I was getting flickering from the pointerEvent of the div
  // conflicting with the pointerEvent of the Deck Map
  // overflowY takes effect when you have a maxHeight!
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 3,
        pointerEvents: pinned ? 'auto' : 'none',
        left:
          x <= window.innerWidth / 2
            ? Math.min(window.innerWidth * 0.3, x)
            : null,
        right:
          x > window.innerWidth / 2
            ? Math.min(window.innerWidth * 0.3, window.innerWidth - x)
            : null,
        top:
          y <= window.innerHeight / 2
            ? Math.min(window.innerHeight * 0.5, y)
            : null,
        bottom:
          y > window.innerHeight / 2
            ? Math.min(window.innerHeight * 0.5, window.innerHeight - y)
            : null,
        width: width,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        overflowY: 'auto',
        backgroundColor: 'white',
      }}
    >
      {props.children}
    </div>
  );
}

export function PhotoTooltip(props) {
  const { object, pointerX, pointerY, pinned = 'none', onCornerClick = null } =
    props || {};

  return (
    <TooltipDiv x={pointerX} y={pointerY} width="70%" pinned={pinned}>
      <Card style={{ width: '100%' }}>
        {pinned && <TooltipPin onClick={onCornerClick} />}
        <Image
          alt={object.properties.description || 'Image'}
          filename={`photos/${object.id}.jpeg`}
        />
        <Card.Content>
          {object && object.properties && object.properties.date && (
            <Card.Meta>
              <span className="date">
                {humanReadableDate(object.properties.date)}
              </span>
            </Card.Meta>
          )}
          {object && object.properties && object.properties.description && (
            <Card.Description>{object.properties.description}</Card.Description>
          )}
        </Card.Content>
      </Card>
    </TooltipDiv>
  );
}

export function TransitTooltip(props) {
  const { object, pointerX, pointerY, pinned = false, onCornerClick = null } =
    props || {};

  let tags;
  let routeURL;
  try {
    tags = JSON.parse(object.properties.tags)
    routeURL = tags.route_url;
  }
  catch {
    console.error('unable to parse tags')
  }

  const {vehicle_type} = object.properties;
  let icon = null;
  if (vehicle_type === 'bus') {
    icon = 'bus';
  } else if (vehicle_type === 'rail') {
    icon = 'train';
  }

  return (
    <TooltipDiv x={pointerX} y={pointerY} width="200px" pinned={pinned}>
      <Card>
        {pinned && <TooltipPin onClick={onCornerClick} />}
        <Card.Content>
          <Card.Header>
            {icon && <Icon name={icon} />}
            {object &&
              object.properties &&
              object.properties.name &&
              toTitleCase(object.properties.name)}
          </Card.Header>
          <Card.Meta>
            <Grid columns={1}>
              <Grid.Row>
                <Grid.Column>
                  {object &&
                    object.properties &&
                    object.properties.operated_by_name && (
                      <span>{object.properties.operated_by_name}</span>
                    )}
                  {'  '}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Meta>
          <Card.Description>
            {routeURL && (
              <a
                href={routeURL}
                target="_blank"
                rel="noopener noreferrer"
                title="Official website"
              >
                Transit website
              </a>
            )}
          </Card.Description>
        </Card.Content>
      </Card>
    </TooltipDiv>
  );
}


export function CurrentWildfireTooltip(props) {
  const { object, pointerX, pointerY, pinned = false, onCornerClick = null } =
    props || {};

  return (
    <TooltipDiv x={pointerX} y={pointerY} width="200px" pinned={pinned}>
      <Card>
        {pinned && <TooltipPin onClick={onCornerClick} />}
        <Card.Content>
          {object && object.properties && object.properties.IncidentNa && (
            <Card.Header>
              {toTitleCase(object.properties.IncidentNa)} Fire
            </Card.Header>
          )}
          {object && object.properties && object.properties.DateCurren && (
            <Card.Meta>
              <span className="date">
                Updated {humanReadableDate(object.properties.DateCurren)}{' '}
              </span>
            </Card.Meta>
          )}
          <Card.Description>
            {object && object.properties && object.properties.GISAcres && (
              <p>
                This fire is estimated to be{' '}
                {Math.round(object.properties.GISAcres)} acres.
              </p>
            )}
            <p>
              Fire boundaries may not be current.{' '}
              <a
                href="https://www.pcta.org/discover-the-trail/backcountry-basics/fire/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more about wildfires on the Pacific Crest Trail.
              </a>
            </p>
          </Card.Description>
        </Card.Content>
      </Card>
    </TooltipDiv>
  );
}

export function NationalParkTooltip(props) {
  const {
    object,
    pointerX,
    pointerY,
    pinned = false,
    useMetric = false,
    onCornerClick = null,
  } = props || {};

  let trailLength;
  if (object && object.properties && object.properties.length) {
    const trailMeters = object.properties.length;
    if (useMetric) {
      const trailKM = Math.round(trailMeters / 1000);
      trailLength = `${trailKM} trail kilometers`;
    } else {
      const trailMiles = Math.round(trailMeters / 1609.34);
      trailLength = `${trailMiles} trail miles`;
    }
  }

  let image;
  if (object && object.properties && object.properties.images) {
    // TODO allow scrolling through NPS images
    image = JSON.parse(object.properties.images)[0];
  }

  const panels = [];
  if (object && object.properties && object.properties.description) {
    panels.push({
      key: 'description',
      title: 'Overview',
      content: object.properties.description,
    });
  }
  if (object && object.properties && object.properties.weatherInfo) {
    panels.push({
      key: 'weather',
      title: 'General Weather',
      content: object.properties.weatherInfo,
    });
  }
  if (object && object.properties && object.properties.directionsInfo) {
    panels.push({
      key: 'directions',
      title: 'Driving Directions',
      content: object.properties.directionsInfo,
    });
  }
  return (
    <TooltipDiv x={pointerX} y={pointerY} pinned={pinned} width="280px">
      <Card>
        {image && (
          <SemanticImage alt={image.altText || 'Image'} src={image.url} />
        )}
        {pinned && <TooltipPin onClick={onCornerClick} />}
        <Card.Content>
          <Card.Header>{object.properties.fullName}</Card.Header>
          <Card.Meta>
            <Grid columns={1}>
              <Grid.Row>
                <Grid.Column>
                  {trailLength && trailLength}
                  {'  '}
                  {object.properties.url && (
                    <a
                      href={object.properties.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Official website"
                    >
                      <Icon link name="globe" />
                    </a>
                  )}
                  {object.properties.wiki_url && (
                    <a
                      href={object.properties.wiki_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Wikipedia Page"
                    >
                      <Icon link name="wikipedia w" />
                    </a>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Meta>
          <Card.Description>
            <Accordion defaultActiveIndex={0} panels={panels} />
          </Card.Description>
          {image && <Card.Meta>Photo © {image.credit}</Card.Meta>}
        </Card.Content>
      </Card>
    </TooltipDiv>
  );
}

export function NationalForestTooltip(props) {
  const {
    object,
    pointerX,
    pointerY,
    pinned = false,
    useMetric = false,
    onCornerClick = null,
  } = props || {};

  let trailLength;
  if (object && object.properties && object.properties.length) {
    const trailMeters = object.properties.length;
    if (useMetric) {
      const trailKM = Math.round(trailMeters / 1000);
      trailLength = `${trailKM} trail kilometers`;
    } else {
      const trailMiles = Math.round(trailMeters / 1609.34);
      trailLength = `${trailMiles} trail miles`;
    }
  }

  return (
    <TooltipDiv x={pointerX} y={pointerY} pinned={pinned} width="280px">
      <Card>
        {object.properties.wiki_image && (
          <SemanticImage alt="Image" src={object.properties.wiki_image} />
        )}
        {pinned && <TooltipPin onClick={onCornerClick} />}
        <Card.Content>
          <Card.Header>{object.properties.forestname}</Card.Header>
          <Card.Meta>
            <Grid columns={1}>
              <Grid.Row>
                <Grid.Column>
                  {trailLength && trailLength}
                  {'  '}
                  {object.properties.official_url && (
                    <a
                      href={object.properties.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Official website"
                    >
                      <Icon link name="globe" />
                    </a>
                  )}
                  {object.properties.wiki_url && (
                    <a
                      href={object.properties.wiki_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Wikipedia Page"
                    >
                      <Icon link name="wikipedia w" />
                    </a>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Meta>
          {object.properties.wiki_summary && (
            <Card.Description>
              {object.properties.wiki_summary}
            </Card.Description>
          )}
        </Card.Content>
      </Card>
    </TooltipDiv>
  );
}

export function WildernessTooltip(props) {
  const {
    object,
    pointerX,
    pointerY,
    pinned = false,
    useMetric = false,
    onCornerClick = null,
  } = props || {};

  console.log(object);

  let trailLength;
  if (object && object.properties && object.properties.length) {
    const trailMeters = object.properties.length;
    if (useMetric) {
      const trailKM = Math.round(trailMeters / 1000);
      trailLength = `${trailKM} trail kilometers`;
    } else {
      const trailMiles = Math.round(trailMeters / 1609.34);
      trailLength = `${trailMiles} trail miles`;
    }
  }

  const panels = [];
  if (object && object.properties && object.properties.descriptio) {
    const content = (
        <p>
          {object.properties.descriptio}
          {'  '}
          <a
            href={object.properties.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Official website"
          >
            Read more.
          </a>
        </p>
    );
    panels.push({
      key: 'description',
      title: 'Overview',
      content: content,
    });
  }
  if (object && object.properties && object.properties.wiki_summary) {
    panels.push({
      key: 'wiki_summary',
      title: 'Wikipedia Summary',
      content: object.properties.wiki_summary,
    });
  }

  return (
    <TooltipDiv x={pointerX} y={pointerY} pinned={pinned} width="280px">
      <Card>
        {object.properties.wiki_image && (
          <SemanticImage alt="Image" src={object.properties.wiki_image} />
        )}
        {pinned && <TooltipPin onClick={onCornerClick} />}
        <Card.Content>
          <Card.Header>{object.properties.name}</Card.Header>
          <Card.Meta>
            <Grid columns={1}>
              <Grid.Row>
                <Grid.Column>
                  {trailLength && trailLength}
                  {'  '}
                  {object.properties.url && (
                    <a
                      href={object.properties.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Official website"
                    >
                      <Icon link name="globe" />
                    </a>
                  )}
                  {object.properties.wiki_url && (
                    <a
                      href={object.properties.wiki_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Wikipedia Page"
                    >
                      <Icon link name="wikipedia w" />
                    </a>
                  )}
                </Grid.Column>
                {object.properties.yeardesign && (
                  <Grid.Column>
                    Designated in {object.properties.yeardesign}
                  </Grid.Column>
                )}
              </Grid.Row>
            </Grid>
          </Card.Meta>
          <Card.Description>
            <Accordion defaultActiveIndex={0} panels={panels} />
          </Card.Description>
        </Card.Content>
      </Card>
    </TooltipDiv>
  );
}

export function HistoricalWildfireTooltip(props) {
  const {
    object,
    pointerX,
    pointerY,
    pinned = false,
    useMetric = false,
    onCornerClick = null,
  } = props || {};

  let trailLength;
  if (object && object.properties && object.properties.length) {
    const trailMeters = object.properties.length;
    if (useMetric) {
      const trailKM = Math.round(trailMeters / 1000);
      trailLength = `${trailKM} trail kilometers`;
    } else {
      const trailMiles = Math.round(trailMeters / 1609.34);
      trailLength = `${trailMiles} trail miles`;
    }
  }

  return (
    <TooltipDiv x={pointerX} y={pointerY} pinned={pinned} width="280px">
      <Card>
        {object.properties.wiki_image && (
          <SemanticImage alt="Image" src={object.properties.wiki_image} />
        )}
        {pinned && <TooltipPin onClick={onCornerClick} />}
        <Card.Content>
          <Card.Header>{object.properties.name} Fire </Card.Header>
          <Card.Meta>
            <Grid columns={1}>
              <Grid.Row>
                {object.properties.year && (
                  <Grid.Column>{object.properties.year}</Grid.Column>
                )}
                <Grid.Column>
                  {trailLength && trailLength}
                  {'  '}
                  {object.properties.inciwebid && (
                    <a
                      href={`https://inciweb.nwcg.gov/incident/${object.properties.inciwebid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Official website"
                    >
                      <Icon link name="globe" />
                    </a>
                  )}
                  {object.properties.wiki_url && (
                    <a
                      href={object.properties.wiki_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Wikipedia Page"
                    >
                      <Icon link name="wikipedia w" />
                    </a>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Meta>
          {object.properties.wiki_summary && (
            <Card.Description>
              {object.properties.wiki_summary}
            </Card.Description>
          )}
        </Card.Content>
      </Card>
    </TooltipDiv>
  );
}

export function WikipediaTooltip(props) {
  const { object, pointerX, pointerY, pinned = false, onCornerClick = null } =
    props || {};

  return (
    <TooltipDiv x={pointerX} y={pointerY} width="280px" pinned={pinned}>
      <Card>
        {pinned && <TooltipPin onClick={onCornerClick} />}
        <SemanticImage
          alt={object.properties.best_image || 'Image'}
          src={object.properties.best_image}
        />
        <Card.Content>
          {object && object.properties && object.properties.title && (
            <Card.Header>
              <a
                href={object.properties.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {object.properties.title}
              </a>
            </Card.Header>
          )}
          {object && object.properties && object.properties.DateCurren && (
            <Card.Meta>
              <span className="date">
                Updated {humanReadableDate(object.properties.DateCurren)}{' '}
              </span>
            </Card.Meta>
          )}
          {object && object.properties && object.properties.summary && (
            <Card.Description>{object.properties.summary}</Card.Description>
          )}
        </Card.Content>
      </Card>
    </TooltipDiv>
  );
}

export class NDFDCurrentTooltip extends React.Component {
  state = {
    forecast: null,
  };

  // Get self hosted url from NDFD URL
  // https://api.weather.gov/gridpoints/HNX/75,147/forecast"
  _getSelfHostedURL = url => {
    console.log(url);
    const parsed = new URL(url);
    const path = parsed.pathname;
    const selfURL = `https://tiles.nst.guide/ndfd_current${path}.geojson`;
    return selfURL;
  };

  componentWillMount = () => {
    const { object } = this.props;
    const forecast_url = object.properties.forecast_url;
    if (!forecast_url) {
      return;
    }

    const selfURL = this._getSelfHostedURL(forecast_url);
    fetch(selfURL)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({ forecast: data });
      });
  };

  render() {
    const { object, pointerX, pointerY, pinned = false, onCornerClick = null } =
      this.props || {};
    const { forecast } = this.state;
    return (
      <TooltipDiv x={pointerX} y={pointerY} width="280px" pinned={pinned}>
        <Card>
          {pinned && <TooltipPin onClick={onCornerClick} />}
          {/* <Card.Content> */}
          {forecast ? (
            <Card.Content>
              <Card.Header>Weather Forecast</Card.Header>
              <Card.Meta>
                Updated {humanReadableDate(forecast.properties.updated)}{' '}
              </Card.Meta>
            </Card.Content>
          ) : (
            <Card.Content>
              <Dimmer active>
                <Loader content="Loading" />
              </Dimmer>
            </Card.Content>
          )}
          {object && object.properties && object.properties.title && (
            <Card.Header>
              <a
                href={object.properties.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {object.properties.title}
              </a>
            </Card.Header>
          )}
          {object && object.properties && object.properties.DateCurren && (
            <Card.Meta>
              <span className="date"></span>
            </Card.Meta>
          )}
          {object && object.properties && object.properties.summary && (
            <Card.Description>{object.properties.summary}</Card.Description>
          )}
          {/* </Card.Content> */}
        </Card>
      </TooltipDiv>
    );
  }
}

function humanReadableDate(dateStr) {
  // Make sure dateStr ends in Z
  // Apparently using Date.parse is very hacky
  // https://stackoverflow.com/a/33909265
  // If the dateStr doesn't end in Z, it's assumed to have the timezone of the
  // current locale
  if (dateStr.slice(-1) !== 'Z') {
    dateStr += 'Z';
  }

  const dateObject = new Date(Date.parse(dateStr));
  const dateReadable = dateObject.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  return dateReadable;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
