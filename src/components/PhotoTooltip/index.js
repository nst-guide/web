import * as React from 'react';
import Image from '../Image';

export function PhotoTooltip(props) {
  const { hoveredObject, pointerX, pointerY } = props || {};

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
        alt={hoveredObject.properties.description || 'Image'}
        filename={`photos/${hoveredObject.id}.jpeg`}
      />
      {hoveredObject.properties.description && (
        <p>{hoveredObject.properties.description}</p>
      )}
    </div>
  );
}
