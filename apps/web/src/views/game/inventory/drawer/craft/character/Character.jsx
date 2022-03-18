import React, { useMemo } from 'react';
import {
  _character,
  _header,
  _title,
  _float,
  _close,
  _grid,
  _row,
  _icon,
} from './Character.styled';
import { useTranslation } from 'react-i18next';
import { IconClose } from 'design/icons/close.icon';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DRAWER_ACTIVE, GAME_SPELLCASTERS } from 'core/remix/state';
import { map } from 'lodash';
import Caster from '../../../../../../shared/caster/Caster';
import { AnimateButton } from '../../../../../../shared/button/animations/AnimateButton';
import { gridList } from 'core/utils/lists';
import { useActions } from '../../../../../../../actions';

const Character = () => {
  const { t } = useTranslation();
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const { closeDrawer } = useActions();

  const list_spellcasters = useMemo(() => {
    if (spellcasters?.length) {
      const list = gridList(spellcasters);

      return map(list, (row) => {
        return (
          <_row>
            {map(row, (caster) => (
              <Caster caster={caster} />
            ))}
          </_row>
        );
      });
    }
  }, [spellcasters]);

  return (
    <_character>
      <_header>
        <_title>{t('drawer.inventory.character.title')}</_title>
        <_float>
          <_close>
            <AnimateButton high>
              <_icon onClick={() => closeDrawer('')}>
                <IconClose />
              </_icon>
            </AnimateButton>
          </_close>
        </_float>
      </_header>
      <_grid>{list_spellcasters}</_grid>
    </_character>
  );
};

export default Character;
