import * as React from 'react';
import { List, Label, Container, Header } from 'semantic-ui-react';

const slopeAngleLevels = [
  ['27°-29°', 'rgb(248, 253, 85)'],
  ['30°-31°', 'rgb(241, 184, 64)'],
  ['32°-34°', 'rgb(238, 128, 49)'],
  ['35°-45°', 'rgb(235, 51, 35)'],
  ['46°-50°', 'rgb(122, 41, 217)'],
  ['51°-59°', 'rgb(0, 38, 245)'],
  ['60°+', 'rgb(0, 0, 0)'],
];

// I couldn't figure out a really simple way to assign the Label component an
// arbitrary RGB color. It looks like they only accept colors that are
// predefined in the global style? In any case, I figured the easiest/quickest
// workaround was just to create small SVG colored boxes
export function SlopeAngleLegend(props) {
  return (
    <Container>
      <Header size="tiny">Legend</Header>
      <List divided>
        {slopeAngleLevels.map(level => (
          <List.Item>
            <Label key={level[0]} horizontal>
              {level[0]}
              <Label.Detail>
                <ColoredSVGBox width={10} color={level[1]} />
              </Label.Detail>
            </Label>
          </List.Item>
        ))}
      </List>
    </Container>
  );
}

function ColoredSVGBox(props) {
  const { color, width = 10 } = props;
  return (
    <svg width={width} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <g color={color}>
        <rect fill="currentColor" width="10" height="10" rx="3" />
      </g>
    </svg>
  );
}
