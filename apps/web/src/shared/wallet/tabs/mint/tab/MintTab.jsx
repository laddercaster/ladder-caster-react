import React, { useMemo } from 'react';
import { _grid, _row, _tab } from './MintTab.styled';
import { useKeys } from 'core/hooks/useKeys';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_CONTEXT,
  GAME_INVENTORY,
  GAME_SPELLCASTERS,
  VIEW_SIZE,
} from 'core/remix/state';
import { gridList } from 'core/utils/lists';
import { map } from 'lodash';
import Item from '../../../item/Item';
import MintConfirm from '../confirm/MintConfirm';
import Caster from '../../../caster/Caster';

const MintTab = () => {
  const [k0, k1, k2, k3] = useKeys(4);
  const [context] = useRemix(DRAWER_CONTEXT);
  const [inventory] = useRemix(GAME_INVENTORY);
  const [view_height] = useRemix(VIEW_SIZE);
  const items = inventory?.items.concat(inventory?.chests);
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);

  const list_items = useMemo(() => {
    if (items?.length) {
      const item_list = gridList(items.concat(spellcasters));

      const itemDisplay = map(item_list, (row, keyRow) => {
        return (
          <_row key={`${keyRow}-row-mint`}>
            {map(row, (item, key) => {
              if (item.type) {
                return <Item key={`${keyRow}-${key}-mint`} item={item} />;
              } else {
                return <Caster key={`${keyRow}-${key}-mint`} caster={item} />;
              }
            })}
          </_row>
        );
      });

      return itemDisplay;
    }
  }, [items, spellcasters]);

  return (
    <_tab $height={view_height}>
      {context?.item || context?.caster ? (
        <MintConfirm />
      ) : (
        <_grid>{list_items}</_grid>
      )}
    </_tab>
  );
};

export default MintTab;
