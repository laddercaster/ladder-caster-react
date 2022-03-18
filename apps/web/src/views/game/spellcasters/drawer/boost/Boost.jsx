import React from 'react';
import { _boost } from './Boost.styled';
import Resource from './resource/Resource';
import { TYPE_EARTH, TYPE_FIRE, TYPE_WATER } from 'core/remix/state';

const Boost = () => {
  return (
    <_boost>
      <Resource element={TYPE_FIRE} />
      <Resource element={TYPE_WATER} />
      <Resource element={TYPE_EARTH} />
    </_boost>
  );
};

export default Boost;
