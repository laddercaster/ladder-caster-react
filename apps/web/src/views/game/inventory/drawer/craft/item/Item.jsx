import React, { useRef } from 'react';
import {
  _item,
  _breakpoint,
  _title,
  _body,
  _choose,
  _row,
  _hat,
  _gem,
  _robe,
  _staff,
  _inner,
} from './Item.styled';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
} from 'core/remix/state';
import Rank from '../../../../spellcasters/drawer/rank/Rank';
import { useSize } from 'core/hooks/useSize';
import { IconHat } from 'design/icons/hat.icon';
import { IconCloak } from 'design/icons/cloak.icon';
import { IconStaff } from 'design/icons/staff.icon';
import { IconGem } from 'design/icons/gem.icon';
import { useActions } from '../../../../../../../actions';

const Item = () => {
  const { t } = useTranslation();
  const { craftChooseItem } = useActions();
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const [context, setContext] = useRemix(DRAWER_CONTEXT);
  const caster = context?.caster;
  const choose_ref = useRef();
  const { width } = useSize(choose_ref);

  return (
    <_item>
      <Rank spell_id={caster?.id} />
      <_breakpoint />
      <_body>
        <_title>{t('drawer.inventory.item.title')}</_title>
        <_choose $height={width} ref={choose_ref}>
          <_row>
            <_hat onClick={() => craftChooseItem(ITEM_HAT)}>
              <_inner $scale={0.95}>
                <IconHat />
              </_inner>
            </_hat>
            <_gem>
              <_inner $scale={1}>
                <IconGem />
              </_inner>
            </_gem>
          </_row>
          <_row>
            <_robe onClick={() => craftChooseItem(ITEM_ROBE)}>
              <_inner $scale={1.1}>
                <IconCloak />
              </_inner>
            </_robe>
            <_staff onClick={() => craftChooseItem(ITEM_STAFF)}>
              <_inner $scale={1.4}>
                <IconStaff />
              </_inner>
            </_staff>
          </_row>
        </_choose>
      </_body>
    </_item>
  );
};

export default Item;
