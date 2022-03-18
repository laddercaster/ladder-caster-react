import React from 'react';
import { _heading, _divider, _title } from './Heading.styled';
import { TicksInstance } from '../../../App';
import Redeem from '../redeem/Redeem';
import Phases from '../phases/Phases';

const Heading = ({ title, flat }) => {
  return (
    <_heading key={'heading-component'}>
      <_title>
        <span>{title}</span>
        <Redeem />
      </_title>
      {TicksInstance}
      <Phases />
      {!flat && <_divider />}
    </_heading>
  );
};

export default Heading;
