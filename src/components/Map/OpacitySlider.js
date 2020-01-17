import * as React from 'react';
import {Form} from 'semantic-ui-react'

export function OpacitySlider(props) {
  const {value, name, onChange} = props;

  return (
    <Form.Input
      label={`Opacity: ${value}`}
      min={0}
      max={1}
      name={name}
      onChange={onChange}
      step={0.05}
      type="range"
      value={value}
    />
  )
}
