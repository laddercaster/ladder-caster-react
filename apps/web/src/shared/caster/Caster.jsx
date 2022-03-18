import React, { useRef } from 'react';
import {
  _caster,
  _level,
  _float,
  _overlay,
  _img,
  _background,
} from './Caster.styled';
import { useSize } from 'core/hooks/useSize';
import { useActions } from '../../../actions';

const Caster = ({ caster }) => {
  const caster_ref = useRef();
  const { width } = useSize(caster_ref);
  const { craftChooseCharacter } = useActions();

  const src = require('../../../../libs/design/assets/Wizard1.png');

  return (
    <_caster
      $grid
      $height={width}
      ref={caster_ref}
      onClick={() => craftChooseCharacter(caster)}
    >
      <_overlay>
        <_level>
          <span>{caster?.level}</span>
        </_level>
      </_overlay>
      <_float>
        <_background $equipped $height={width} />
      </_float>
      <_img src={src} alt={'Wizard NFT'} $height={width} />
    </_caster>
  );
};

export default Caster;
