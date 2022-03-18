import React, { useRef } from 'react';
import { _item, _float, _background } from './Item.styled';
import { useTranslation } from 'react-i18next';
import { AnimateSlide } from '../../../animations/AnimateSlide';
import NFT from '../../../../nft/NFT';
import { INVERSE_EQUIP_MAP } from 'core/utils/switch';

const Item = ({ index, count, info, height }) => {
  const { t } = useTranslation();
  const item_ref = useRef();
  const active = index === count;
  const prev = index === count - 1;
  const next = index === count + 1;

  return (
    <AnimateSlide index={index} active={active} prev={prev} next={next}>
      <_item ref={item_ref} $width={100} $active={active}>
        <_float>
          <_background $height={height} $rarity={info?.rarity} />
        </_float>
        <_float>
          <NFT height={height} type={info?.type} tier={info?.tier} />
        </_float>
      </_item>
    </AnimateSlide>
  );
};

export default Item;
