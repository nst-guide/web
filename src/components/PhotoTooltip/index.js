import * as React from 'react';
import Image from '../Image';

export function PhotoTooltip(props) {
  const { object, pointerX, pointerY } = props || {};

  return (
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
            ? Math.min(window.innerWidth * 0.3, window.innerWidth - pointerX)
            : null,
        top:
          pointerY <= window.innerHeight / 2
            ? Math.min(window.innerHeight * 0.5, pointerY)
            : null,
        bottom:
          pointerY > window.innerHeight / 2
            ? Math.min(window.innerHeight * 0.5, window.innerHeight - pointerY)
            : null,
        width: '70%',
        maxWidth: '600px',
        backgroundColor: 'white',
      }}
    >
      <Image
        alt={object.properties.description || 'Image'}
        filename={`photos/${object.id}.jpeg`}
      />
      {object.properties.description && (
        <p>{object.properties.description}</p>
      )}
    </div>
  );
}
