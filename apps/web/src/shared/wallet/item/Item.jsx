import React, { useRef } from 'react';
import { _item, _float, _background } from './Item.styled';
import { _NFT } from '../nft/NFT.styled';
import { useSize } from 'core/hooks/useSize';
import { useActions } from '../../../../actions';
import NFT from 'web/src/shared/nft/NFT';
import { INVERSE_EQUIP_MAP } from 'core/utils/switch';
import { ITEM_CHEST } from 'core/remix/state';

const Item = ({ item }) => {
  const item_ref = useRef();
  const { width, height } = useSize(item_ref);
  const { chooseMint } = useActions();

  return (
    <_item
      $grid
      $height={width}
      ref={item_ref}
      onClick={() => chooseMint(item)}
    >
      <_float>
        <_background
          $height={height}
          $rarity={item?.rarity}
          $isChest={item?.type === ITEM_CHEST}
        />
      </_float>
      <_float>
        <NFT
          height={height}
          type={INVERSE_EQUIP_MAP[item?.type]}
          tier={item?.tier}
        />
      </_float>
    </_item>
  );
};

export default Item;
