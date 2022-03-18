import React from 'react';
import {
  _rank,
  _tier,
  _name,
  _burn,
  _level,
  _progress,
  _wrapper,
  _loading,
  _icon,
  _close,
  _current,
  _upcoming,
} from './Rank.styled';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DRAWER_ACTIVE, GAME_SPELLCASTERS } from 'core/remix/state';
import Progress from './progress/Progress';
import { AnimateButton } from '../../../../../shared/button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { find } from 'lodash';
import { useActions } from '../../../../../../actions';

const Rank = ({ caster }) => {
  const { t } = useTranslation();
  const [, setDrawer] = useRemix(DRAWER_ACTIVE);
  const { boostXP } = useActions();

  const level = caster?.level || 1;

  return (
    <_rank>
      <_wrapper $end>
        <_tier>
          <_name>{t('drawer.rank.name')}</_name>
          <_burn>
            <button onClick={() => boostXP(caster)}>
              {t('drawer.rank.burn')}
            </button>
          </_burn>
        </_tier>
      </_wrapper>
      <_wrapper $full>
        <_level>
          <_loading>
            <Progress caster={caster} />
          </_loading>
          <_progress>
            <_current>{`${t('drawer.rank.level')} ${level}`}</_current>
            <_upcoming>{`${t('drawer.rank.level')} ${level + 1}`}</_upcoming>
          </_progress>
        </_level>
        <_close>
          <AnimateButton high>
            <_icon onClick={() => setDrawer('')}>
              <IconClose />
            </_icon>
          </AnimateButton>
        </_close>
      </_wrapper>
    </_rank>
  );
};

export default Rank;
