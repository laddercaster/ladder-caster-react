import React, { useMemo, useState, useEffect } from 'react';
import {
  _queue,
  _action,
  _icon,
  _float,
  _lock,
  _title,
  _actions,
  _claim,
} from './Queue.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../actions';
import {
  DEMO_MODE,
  DRAWER_ACTIVE,
  GAME_MAP,
  GAME_SPELLCASTERS,
  TYPE_CRAFT,
  TYPE_LEGENDARY,
  TYPE_EARTH,
  TYPE_FIRE,
  TYPE_WATER,
  PHASE_ACTIONS,
  USER_PHASE,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { find } from 'lodash';
import { AnimateButton } from '../../../../../shared/button/animations/AnimateButton';
import { IconBook } from 'design/icons/book.icon';
import { IconMove } from 'design/icons/move.icon';
import { IconAnvil } from 'design/icons/anvil.icon';
import { IconTreasure } from 'design/icons/treasure.icon';
import { IconFiree } from 'design/icons/firee.icon';
import { IconWater } from 'design/icons/water.icon';
import { IconEarth } from 'design/icons/earth.icon';
import { IconLock } from 'design/icons/lock.icon';
import { AnimatePresence } from 'framer-motion';
import { AnimateLock } from '../animations/AnimateLock';
import { CHAIN_GAME } from 'chain/hooks/state';

const Queue = ({ spell_id }) => {
  const [clicked, setClicked] = useState('');
  const {
    modalMove,
    modalSpell,
    modalLoot,
    modalCraft,
    modalRedeem,
  } = useActions();
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [phase] = useRemix(USER_PHASE);
  const [game] = useRemix(CHAIN_GAME);
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const { t } = useTranslation();
  const caster = useMemo(
    () => find(spellcasters, (caster) => caster?.id === spell_id && caster),
    [spellcasters?.length],
  );
  const currentTurn = game?.turnInfo?.turn;
  const [num_ticks] = useRemix(DEMO_MODE, (demo) => demo.num_ticks);
  const position = caster?.position;
  const searchPosition =
    caster?.casterActionPosition && !caster?.isLootActionBefore
      ? caster?.casterActionPosition
      : position;
  const [tile] = useRemix(
    GAME_MAP,
    (rows) =>
      find(rows, (row) => row?.level + 1 === +searchPosition?.[1])?.[
        searchPosition?.[0]
      ],
  );

  const locked_loot = caster?.last_loot < (num_ticks || currentTurn);
  const locked_craft = caster?.last_craft < (num_ticks || currentTurn);
  const locked_spell =
    caster?.last_spell >= (num_ticks || currentTurn) &&
    !(!caster?.spell && phase === PHASE_ACTIONS);
  const locked_move = caster?.last_move < (num_ticks || currentTurn);

  const remaining = tile?.remaining;
  const element = tile?.type;

  const IconElement = {
    [TYPE_FIRE]: IconFiree,
    [TYPE_WATER]: IconWater,
    [TYPE_EARTH]: IconEarth,
    [TYPE_CRAFT]: IconAnvil,
    [TYPE_LEGENDARY]: IconTreasure,
  }[element];

  const PositionMemo = useMemo(() => {
    if (position) {
      return caster?.casterActionPosition
        ? () => <b>{` ${caster?.casterActionPosition?.toUpperCase()}`}</b>
        : () => <b>{` ${position.toUpperCase()}`}</b>;
    }
    return () => null;
  }, [position, caster?.casterActionPosition]);

  useEffect(() => {
    let timeout;
    if (clicked) {
      timeout = setTimeout(() => {
        setClicked('');
      }, 250);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [clicked]);

  const needsToRedeem = useMemo(() => {
    const turnCommitTurn = caster?.turnCommit;

    const currentTurn = game?.turnInfo?.turn;

    return turnCommitTurn < currentTurn;
  }, [caster?.turnCommit?.turn, game?.turnInfo?.turn]);

  return (
    <_queue>
      <_title>
        {t('spellcasters.actions')}
        <PositionMemo />
      </_title>
      <_actions>
        {needsToRedeem ? (
          <AnimateButton element={TYPE_LEGENDARY}>
            <_claim onClick={() => modalRedeem(caster)}>
              {t('spellcasters.claim')}
            </_claim>
          </AnimateButton>
        ) : (
          <>
            {element === TYPE_CRAFT || element === TYPE_LEGENDARY ? (
              <AnimateButton
                low
                shake={clicked === 'craft' && !locked_craft}
                element={element}
              >
                <_action
                  onClick={() => {
                    !locked_craft ? setClicked('craft') : modalCraft(caster);
                  }}
                >
                  <_icon $element={element}>
                    {!!IconElement ? <IconElement /> : undefined}
                    <span>{t('spellcaster.action.craft')}</span>
                  </_icon>
                  <_float>
                    <AnimatePresence>
                      {!locked_craft && (
                        <AnimateLock key={'animate-lock-craft'}>
                          <_lock $element={element}>
                            <IconLock />
                          </_lock>
                        </AnimateLock>
                      )}
                    </AnimatePresence>
                  </_float>
                </_action>
              </AnimateButton>
            ) : (
              <AnimateButton
                low
                shake={clicked === 'loot' && !locked_loot}
                element={element}
              >
                <_action
                  onClick={() => {
                    !locked_loot ? setClicked('loot') : modalLoot(caster);
                  }}
                >
                  <_icon $element={element}>
                    {!!IconElement ? <IconElement /> : undefined}
                    <span>{t('spellcaster.action.loot')}</span>
                  </_icon>
                  <_float>
                    <AnimatePresence>
                      {!locked_loot && (
                        <AnimateLock key={'animate-lock-loot'}>
                          <_lock $element={element}>
                            <IconLock />
                          </_lock>
                        </AnimateLock>
                      )}
                    </AnimatePresence>
                  </_float>
                </_action>
              </AnimateButton>
            )}
            <AnimateButton shake={clicked === 'move' && !locked_move}>
              <_action
                onClick={() =>
                  !locked_move ? setClicked('move') : modalMove(caster)
                }
              >
                <_icon $basic>
                  <IconMove />
                  <span>{t('spellcaster.action.move')}</span>
                </_icon>
                <_float>
                  <AnimatePresence>
                    {!locked_move && (
                      <AnimateLock key={'animate-lock-move'}>
                        <_lock $basic>
                          <IconLock />
                        </_lock>
                      </AnimateLock>
                    )}
                  </AnimatePresence>
                </_float>
              </_action>
            </AnimateButton>
            <AnimateButton shake={clicked === 'spell' && !locked_spell}>
              <_action
                onClick={() =>
                  !locked_spell ? setClicked('spell') : modalSpell(caster)
                }
              >
                <_icon $basic>
                  <IconBook />
                  <span>{t('spellcaster.action.spell')}</span>
                </_icon>
                <_float>
                  <AnimatePresence>
                    {!locked_spell && (
                      <AnimateLock key={'animate-lock-spell'}>
                        <_lock $basic>
                          <IconLock />
                        </_lock>
                      </AnimateLock>
                    )}
                  </AnimatePresence>
                </_float>
              </_action>
            </AnimateButton>
          </>
        )}
      </_actions>
    </_queue>
  );
};

export default Queue;
