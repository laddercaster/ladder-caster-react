import React, { useMemo, useRef } from 'react';
import {
  _materials,
  _breakpoint,
  _grid,
  _confirm,
  _button,
  _text,
  _selected,
  _material,
  _container,
  _title,
  _odds,
  _lowest,
  _highest,
  _percent,
  _chance,
} from './Materials.styled';
import Rank from '../../../../spellcasters/drawer/rank/Rank';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  GAME_INVENTORY,
  GAME_MAP,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
  TIER_I,
  TIER_II,
  TIER_III,
  TIER_IV,
  TYPE_LEGENDARY,
  VIEW_SIZE,
} from 'core/remix/state';
import { gridList } from 'core/utils/lists';
import { map } from 'lodash';
import { _row } from '../character/Character.styled';
import { filter, find } from 'lodash';
import Item from '../../../../../../shared/item/Item';
import { useSize } from 'core/hooks/useSize';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../../actions';

const Materials = () => {
  const { t } = useTranslation();
  const [drawer] = useRemix(DRAWER_ACTIVE);
  const [context] = useRemix(DRAWER_CONTEXT);
  const [game_map] = useRemix(GAME_MAP);
  const [inventory] = useRemix(GAME_INVENTORY);
  const [view_height] = useRemix(VIEW_SIZE);
  const material_ref = useRef();
  const material_size = useSize(material_ref);
  const caster = context?.caster;
  const position = context?.caster?.position;
  const item_type = context?.item;
  const materials = context?.materials;
  const { craftChooseMaterials, removeMaterials, craftItem } = useActions();

  const position_type = useMemo(() => {
    for (let i = 0; i < game_map?.length; i++) {
      let col = position?.[0];
      let level = +position?.slice(1);
      let row = game_map?.[i];

      if (row?.level === level) {
        const tile = game_map?.[i]?.[col];
        return tile?.type;
      }
    }
  }, [position]);

  const rank_rarities = {
    [RARITY_COMMON]: 1,
    [RARITY_RARE]: 2,
    [RARITY_EPIC]: 3,
    [RARITY_LEGENDARY]: 4,
  };

  const rarity_rank = [
    '',
    RARITY_COMMON,
    RARITY_RARE,
    RARITY_EPIC,
    RARITY_LEGENDARY,
  ];

  const tier_range = [
    [TIER_I, TIER_II, TIER_III, TIER_IV],
    [10, 15, 20, 30],
  ];

  const craft_item = useMemo(() => {
    let min_rarity = 4;
    let min_level = 30;
    let min_tier = TIER_IV;
    let max_tier = TIER_I;
    for (let i = 0; i < materials?.length; i++) {
      const item = materials?.[i];
      const rank = rank_rarities?.[item?.rarity];
      min_rarity = rank < min_rarity ? rank : min_rarity;
      min_level = item?.level < min_level ? item?.level : min_level;
    }
    for (let i = 0; i < materials?.length; i++) {
      const item_level = materials?.[i]?.level;
      for (let t = 0; t < tier_range[0]; t++) {
        if (item_level <= tier_range[1][t]) {
          min_tier = tier_range[0][t];
          break;
        }
      }
    }

    const isLegendary = position_type === TYPE_LEGENDARY;
    let max_rarity = min_rarity;
    let max_level = min_level;

    if (isLegendary) {
      if (rarity_rank[min_rarity] === RARITY_LEGENDARY) {
        max_level++;
      } else max_rarity++;
    } else {
      if (rarity_rank[min_rarity] === RARITY_EPIC) {
        max_level++;
      } else max_rarity++;
    }

    return {
      type: item_type,
      min_rarity: rarity_rank[min_rarity],
      min_level,
      min_tier,
      max_rarity: rarity_rank[max_rarity],
      max_level,
      max_tier,
    };
  }, [item_type, materials]);

  const lowest_item = {
    type: craft_item?.type,
    level: craft_item?.min_level,
    rarity: craft_item?.min_rarity,
    tier: craft_item?.min_tier,
  };

  const highest_item = {
    type: craft_item?.type,
    level: craft_item?.max_level,
    rarity: craft_item?.max_rarity,
    tier: craft_item?.max_tier,
  };

  const confirm = materials?.[0] && materials?.[1] && materials?.[2];

  const filter_items = filter(
    inventory?.items,
    (item) => item.type === item_type,
  );

  const list_items = useMemo(() => {
    if (filter_items?.length) {
      const list = gridList(filter_items);

      return map(list, (row) => {
        return (
          <_row>
            {map(row, (item) => {
              const selected = find(
                materials,
                (material) => material?.id === item?.id,
              );
              return (
                <Item
                  grid
                  item={item}
                  selected={selected}
                  callback={() => !selected && craftChooseMaterials(item)}
                />
              );
            })}
          </_row>
        );
      });
    }
  }, [filter_items]);

  return (
    <_materials $height={view_height}>
      <Rank spell_id={caster?.id} />
      <_breakpoint />
      <_selected>
        <_material $height={material_size?.height} ref={material_ref}>
          {materials?.[0] && (
            <Item
              small
              item={materials?.[0]}
              callback={() => removeMaterials(0)}
            />
          )}
        </_material>
        <_material>
          {materials?.[1] && (
            <Item
              small
              item={materials?.[1]}
              callback={() => removeMaterials(1)}
            />
          )}
        </_material>
        <_material>
          {materials?.[2] && (
            <Item
              small
              item={materials?.[2]}
              callback={() => removeMaterials(2)}
            />
          )}
        </_material>
      </_selected>
      <_breakpoint />
      <_title>{!confirm && t('drawer.inventory.materials.title')}</_title>
      <_container>
        {confirm ? (
          <_confirm>
            <_text>{t('drawer.inventory.confirm.text')}</_text>
            <_odds>
              <_lowest>
                <_percent>
                  <_chance>75%</_chance>
                </_percent>
                <Item craft item={lowest_item} />
              </_lowest>
              <_highest>
                <_percent>
                  <_chance>25%</_chance>
                </_percent>
                <Item craft item={highest_item} />
              </_highest>
            </_odds>
            <_button onClick={() => craftItem(caster)}>
              {t('drawer.inventory.confirm.button')}
            </_button>
          </_confirm>
        ) : (
          <_grid>{list_items}</_grid>
        )}
      </_container>
    </_materials>
  );
};

export default Materials;
