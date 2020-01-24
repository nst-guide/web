import * as React from 'react';
import { Card } from 'semantic-ui-react';

function TooltipDiv(props) {
  const {x, y, width = '70%', maxWidth = '600px'} = props;
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
        // backgroundColor: 'white',
      }}
    >
      {props.children}
    </div>
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

function humanReadableDate(dateStr) {
  const dateObject = new Date(Date.parse(dateStr));
  const dateReadable = dateObject.toDateString();
  return dateReadable;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
