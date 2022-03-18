import React from 'react';
import { _category, _title, _items, _item, _cutout } from './Category.styled';
import {
  DRAWER_ACTIVE,
  GAME_INVENTORY,
  ITEM_BOOK,
  ITEM_GEM,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useTranslation } from 'react-i18next';
import { filter } from 'lodash';
import { EQUIP_MAP, ICON_EQUIP_MAP } from 'core/utils/switch';
import Item from '../../../../shared/item/Item';
import { useActions } from '../../../../../actions';

const Category = ({ type }) => {
  const { t } = useTranslation();
  const { openDrawerInventory } = useActions();
  const [, setDrawer] = useRemix(DRAWER_ACTIVE);
  const [inventory] = useRemix(GAME_INVENTORY);

  const title = {
    [ITEM_HAT]: t('inventory.title.hat'),
    [ITEM_ROBE]: t('inventory.title.robe'),
    [ITEM_STAFF]: t('inventory.title.staff'),
    [ITEM_GEM]: t('inventory.title.gem'),
    [ITEM_BOOK]: t('inventory.title.book'),
  }[type];

  const Icon = ICON_EQUIP_MAP[type];

  const item_type = EQUIP_MAP[type];

  const items_list = filter(
    inventory?.items,
    (item) => item.type === item_type,
  );

  const min_items = items_list?.length > 7 ? items_list.length : 7;

  const items = () => {
    let list = [];

    for (let i = 0; i < min_items; i++) {
      const item = items_list[i];

      list.push(
        <_item key={`${i}-category`}>
          <_cutout>
            {item && (
              <Item
                small
                item={item}
                callback={() => openDrawerInventory(item)}
              />
            )}
          </_cutout>
        </_item>,
      );
    }
    return list;
  };

  return (
    <_category>
      <_title>
        <Icon />
        {title}
      </_title>
      <_items>{items()}</_items>
    </_category>
  );
};

export default Category;
