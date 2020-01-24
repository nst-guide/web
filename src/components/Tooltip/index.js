import * as React from 'react';
import { Card } from 'semantic-ui-react';
import Image from '../Image';

function TooltipDiv(props) {
  const { x, y, width = '70%', maxWidth = '600px' } = props;
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 3,
        pointerEvents: 'none',
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
        backgroundColor: 'white',
      }}
    >
      {props.children}
    </div>
  );
}

export function PhotoTooltip(props) {
  const { object, pointerX, pointerY } = props || {};

  return (
    <TooltipDiv x={pointerX} y={pointerY} width="70%">
      <Card style={{ width: '100%' }}>
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

export function CurrentWildfireTooltip(props) {
  const { object, pointerX, pointerY } = props || {};

  return (
    <TooltipDiv x={pointerX} y={pointerY} width="200px">
      <Card>
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
              <a href="https://www.pcta.org/discover-the-trail/backcountry-basics/fire/">
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
  const { object, pointerX, pointerY } = props || {};
  return (
    <TooltipDiv x={pointerX} y={pointerY} width="200px">
      <Card>
        <Card.Content>
          <Card.Header>{object.properties.UNIT_NAME}</Card.Header>
          <Card.Description></Card.Description>
        </Card.Content>
      </Card>
    </TooltipDiv>
  );
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
