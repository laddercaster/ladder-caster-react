import React from 'react';
import { _spellcasters, _header, _title, _list } from './Spellcasters.styled';
import Item from './item/Item';
import { useTranslation } from 'react-i18next';
import { TicksInstance } from 'web/App';
import { GAME_SPELLCASTERS, SPELLCASTER_BUY } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { nanoid } from 'nanoid';
import { _button, _controls, _speed } from '../header/Header.styled';
import { useNextTurn } from 'chain/hooks/useNextTurn';
import { _wallet } from '../inventory/Inventory.styled';
import Wallet from '../../../shared/wallet/WalletHeader';
import Heading from '../../../shared/heading/Heading';
import { sortBy } from 'lodash';

const Spellcasters = () => {
  const { t } = useTranslation();
  const { nextTurn } = useNextTurn();
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);

  const render_spellcasters = () => {
    if (spellcasters && spellcasters.length >= 1) {
      return sortBy(spellcasters, (sort) => sort?.publicKey).map((caster) => (
        <Item key={nanoid()} spell_id={caster.id} />
      ));
    }
  };

  return (
    <_spellcasters>
      <Heading title={t('title.casters')} />
      <_list>
        {render_spellcasters()}
        <Item key={SPELLCASTER_BUY} spell_id={SPELLCASTER_BUY} />
      </_list>
    </_spellcasters>
  );
};

export default Spellcasters;
