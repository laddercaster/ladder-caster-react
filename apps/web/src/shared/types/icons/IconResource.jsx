import React from 'react';
import { TYPE_EARTH, TYPE_FIRE, TYPE_GOLD, TYPE_WATER } from 'core/remix/state';
import { IconMoneyBag } from 'design/icons/money-bag.icon';
import { IconFiree } from 'design/icons/firee.icon';
import { IconWater } from 'design/icons/water.icon';
import { IconEarth } from 'design/icons/earth.icon';

const IconResource = ({ type }) => {
  const Icon = {
    [TYPE_GOLD]: IconMoneyBag,
    [TYPE_FIRE]: IconFiree,
    [TYPE_WATER]: IconWater,
    [TYPE_EARTH]: IconEarth,
  }[type];

  return (!!Icon && <Icon />) || null;
};

export default IconResource;
