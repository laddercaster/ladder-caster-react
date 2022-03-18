import React from 'react';
import {
  _header,
  _container,
  _left,
  _right,
  _coin,
  _icon,
  _amount,
  _google,
  _button,
  _speed,
  _controls,
} from './Header.styled';
import { withTheme } from 'styled-components';
import { IconWater } from 'design/icons/water.icon';
import { IconLeaf } from 'design/icons/leaf.icon';
import { IconFiree } from 'design/icons/firee.icon';
import { IconMoney } from 'design/icons/money.icon';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DEMO_MODE,
  GAME_RESOURCES,
  TYPE_EARTH,
  TYPE_FIRE,
  TYPE_WATER,
} from 'core/remix/state';
import { useActions } from 'web/actions';
import { AnimateButton } from '../../../shared/button/animations/AnimateButton';
import { IconSkip } from 'design/icons/skip.icon';
import { useLocalWallet } from 'chain/hooks/useLocalWallet';
import { CHAIN_GAME, CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import Counter from '../../../shared/counter/Counter';
import usePrevious from 'core/hooks/usePrevious';
import { TorusButton } from '../../../shared/torus/TorusButton';

const Header = withTheme(({ theme }) => {
  const { t } = useTranslation();
  const { startDemo, nextTurn, openDrawerTokens } = useActions();
  const [demo, setDemo] = useRemix(DEMO_MODE);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [game] = useRemix(CHAIN_GAME);
  const [resources] = useRemix(GAME_RESOURCES);
  const { createLocalWallet } = useLocalWallet();

  const prevGold = usePrevious(+resources?.lada || 0);
  const prevFire = usePrevious(+resources?.fire || 0);
  const prevWater = usePrevious(+resources?.water || 0);
  const prevEarth = usePrevious(+resources?.earth || 0);

  const active = client !== undefined ? client : demo?.active;

  return (
    <_header>
      <_container>
        <_left onClick={() => demo && openDrawerTokens()}>
          <_coin>
            <_icon $background={theme.element['legendary']}>
              <IconMoney />
            </_icon>
            {active && <Counter from={prevGold} to={+resources?.lada} />}
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_FIRE]}>
              <IconFiree />
            </_icon>
            {active && <Counter from={prevFire} to={+resources?.fire} />}
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_WATER]}>
              <IconWater />
            </_icon>
            {active && <Counter from={prevWater} to={+resources?.water} />}
          </_coin>
          <_coin>
            <_icon $background={theme.element[TYPE_EARTH]}>
              <IconLeaf />
            </_icon>
            {active && <Counter from={prevEarth} to={+resources?.earth} />}
          </_coin>
        </_left>
        <_right>
          {!active && <TorusButton />}
          {active && (
            <_controls>
              <_speed>
                {/* Need to get from rust & demo */}
                {t('header.day')}{' '}
                {!isNaN(game?.turnInfo?.turn)
                  ? game?.turnInfo?.turn
                  : demo?.num_ticks}
              </_speed>
            </_controls>
          )}
          {active && (
            <AnimateButton>
              <_button onClick={() => nextTurn()}>
                <IconSkip />
              </_button>
            </AnimateButton>
          )}
        </_right>
      </_container>
    </_header>
  );
});

export default Header;
