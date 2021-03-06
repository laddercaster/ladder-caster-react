import React, { useMemo } from 'react';
import { _details, _text, _end, _risk, _odds, _cost } from './Details.styled';
import { useTranslation } from 'react-i18next';
import { IconFiree } from 'design/icons/firee.icon';
import { IconWater } from 'design/icons/water.icon';
import { IconEarth } from 'design/icons/earth.icon';
import { IconDice } from 'design/icons/dice.icon';
import {
  ATTRIBUTE_CRAFT,
  ATTRIBUTE_EARTH,
  ATTRIBUTE_FIRE,
  ATTRIBUTE_ITEM,
  ATTRIBUTE_WATER,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
} from 'core/remix/state';
import Craft from './craft/Craft';
import Item from './item/Item';
import Resource from './resource/Resource';

const Details = ({ item }) => {
  const { t } = useTranslation();

  const text = {
    [ATTRIBUTE_FIRE]: <Resource type={item?.attribute} value={item?.value} />,
    [ATTRIBUTE_WATER]: <Resource type={item?.attribute} value={item?.value} />,
    [ATTRIBUTE_EARTH]: <Resource type={item?.attribute} value={item?.value} />,
    [ATTRIBUTE_CRAFT]: <Craft level={item?.level} />,
    [ATTRIBUTE_ITEM]: <Item level={item?.level} />,
  }[item?.attribute];

  const odds = {
    [RARITY_COMMON]: t('modal.spell.odds.common'),
    [RARITY_RARE]: t('modal.spell.odds.rare'),
    [RARITY_EPIC]: t('modal.spell.odds.epic'),
    [RARITY_LEGENDARY]: t('modal.spell.odds.legendary'),
  }[item?.rarity];

  const elementIcon = useMemo(() => {
    switch (item?.costFeature) {
      case 'fire': {
        return <IconFiree />;
      }
      case 'water': {
        return <IconWater />;
      }
      case 'earth': {
        return <IconEarth />;
      }
      default: {
        return <IconEarth />;
      }
    }
  }, [item?.costFeature]);

  return (
    <_details>
      <_text>{text}</_text>
      <_end>
        <_risk>
          <_odds>
            <IconDice />
            <span>{odds}</span>
          </_odds>
          <_cost>
            {elementIcon}
            <span>{item?.cost}</span>
          </_cost>
        </_risk>
      </_end>
    </_details>
  );
};

export default Details;
