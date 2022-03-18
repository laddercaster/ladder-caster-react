import React, { useRef } from 'react';
import {
  _item,
  _background,
  _float,
  _selected,
  _level,
  _overlay,
  _checkmark,
} from './Item.styled';
import { useSize } from 'core/hooks/useSize';
import { useActions } from '../../../actions';
import NFT from '../nft/NFT';

const Item = ({ item, grid, small, craft, selected, callback }) => {
  const materials_ref = useRef();
  const { width } = useSize(materials_ref);

  return (
    <_item
      $grid={grid}
      $height={width}
      ref={materials_ref}
      onClick={() => callback && callback()}
    >
      {!small && (
        <_overlay>
          <_level>
            <span>{item?.level}</span>
          </_level>
        </_overlay>
      )}
      {!small && !craft && (
        <_overlay>
          {selected && (
            <_selected $height={width}>
              <_checkmark />
            </_selected>
          )}
        </_overlay>
      )}
      <_float>
        <_background $equipped $height={width} $rarity={item?.rarity} />
      </_float>
      <NFT
        zindex={'drawer_base'}
        type={item?.type}
        tier={item?.tier}
        $height={width}
      />
    </_item>
  );
};

export default Item;
