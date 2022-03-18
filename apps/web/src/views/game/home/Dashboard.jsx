import React, { useState, useEffect, useMemo } from 'react';
import {
  _home,
  _header,
  _title,
  _feed,
  _section,
  _description,
  _button,
  _actions,
  _item,
  _step,
  _order,
  _task,
  _divider,
  _button_override,
} from './Dashboard.styled';
import { useTranslation } from 'react-i18next';
import { TicksInstance } from '../../../../App';
import { IconWallet } from 'design/icons/wallet.icon';
import { DEMO_MODE, GAME_MAP, TIER_I } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useActions } from 'web/actions';
import { IconHat } from 'design/icons/hat.icon';
import { IconMap } from 'design/icons/map.icon';
import { IconCoin } from 'design/icons/coin.icon';
import { IconUser } from 'design/icons/user.icon';
import { AnimateButton } from '../../../shared/button/animations/AnimateButton';
import { map as _map } from 'lodash';
import { nanoid } from 'nanoid';
import { useLocalWallet } from 'chain/hooks/useLocalWallet';
import { _controls, _speed } from '../header/Header.styled';
import { _wallet } from '../inventory/Inventory.styled';
import WalletHeader from '../../../shared/wallet/WalletHeader';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Heading from '../../../shared/heading/Heading';
import {
  CHAIN_LOCAL_CLIENT,
  CHAIN_PLAYER,
  CHAIN_LADA_ACCOUNT,
} from 'chain/hooks/state';

const Dashboard = () => {
  const { t } = useTranslation();
  const [demo] = useRemix(DEMO_MODE);
  const [map, setMap] = useRemix(GAME_MAP);
  const [player] = useRemix(CHAIN_PLAYER);
  const [ladaAccount] = useRemix(CHAIN_LADA_ACCOUNT);
  const { createLocalWallet } = useLocalWallet();
  const { setVisible } = useWalletModal();
  const {
    startDemo,
    visitCasters,
    visitMap,
    initPlayer,
    initLadaAccount,
    modalImportKey,
  } = useActions();
  const [next_map] = useState();
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);

  const connectWallet = () => {
    setVisible(true);
  };

  const generateTestWallet = async () => {
    createLocalWallet();
    if (demo) startDemo();
  };

  let new_map = map ? [...map] : [];

  useEffect(() => {
    if (next_map) {
      const show_map = _map(next_map?.map, (tile) => {
        const col = {
          ['1']: 'a',
          ['2']: 'b',
          ['3']: 'c',
        }[`${tile.column}`];

        return {
          level: tile.level,
          remaining: tile.life,
          tier: TIER_I,
          type: Object.keys(tile.feature)[0],
          id: nanoid(),
          col,
        };
      });

      new_map[0] = {
        a: show_map[0],
        b: show_map[1],
        c: show_map[2],
        level: show_map[0].level,
      };

      setMap(new_map);
    }
  }, [next_map]);

  const { active, account, initialized, hasPlayer } = useMemo(() => {
    if (client !== undefined) {
      const account = player && ladaAccount;
      return {
        active: client,
        account,
        initialized: account && client,
        hasPlayer: player,
      };
    }
    const account = demo?.player && demo?.ladaAccount;
    return {
      active: demo?.active,
      account,
      initialized: account && demo?.active,
      hasPlayer: demo?.player,
    };
  }, [client, demo, player, ladaAccount]);

  return (
    <_home>
      <Heading title={t('title.home')} />
      <_feed>
        {!active && (
          <_section>
            <_description>{t('home.description')}</_description>
            <_actions $long>
              <AnimateButton high>
                <_button $long onClick={() => connectWallet()}>
                  <IconWallet />
                  <span>{t('connect.wallet')}</span>
                </_button>
              </AnimateButton>
              <AnimateButton low>
                <_button $long onClick={() => modalImportKey()}>
                  <IconWallet />
                  <span>{t('import.generate.wallet')}</span>
                </_button>
              </AnimateButton>
              <AnimateButton low>
                <_button $long onClick={() => generateTestWallet()}>
                  <IconWallet />
                  <span>{t('connect.local_wallet')}</span>
                </_button>
              </AnimateButton>
            </_actions>
          </_section>
        )}
        {active && !account && (
          <>
            <_step>
              <_order>1</_order>
              <_item>
                <_task $disabled={demo?.player}>
                  {t('home.task.init.player')}
                </_task>
                <_actions>
                  <AnimateButton low>
                    <_button
                      disabled={hasPlayer}
                      $disabled={hasPlayer}
                      onClick={() => initPlayer()}
                    >
                      <IconUser />
                      <span>
                        {!hasPlayer
                          ? t('player.initialize')
                          : t('player.initialized')}
                      </span>
                    </_button>
                  </AnimateButton>
                </_actions>
              </_item>
            </_step>
            <_step>
              <_order>2</_order>
              <_item>
                <_task $disabled={!hasPlayer}>
                  {t('home.task.init.token.account')}
                </_task>
                <_actions>
                  <AnimateButton low>
                    <_button
                      disabled={!hasPlayer}
                      $disabled={!hasPlayer}
                      onClick={() => initLadaAccount()}
                    >
                      <IconCoin />
                      <span>{t('account.opt.in')}</span>
                    </_button>
                  </AnimateButton>
                </_actions>
              </_item>
            </_step>
          </>
        )}
        {initialized && (
          <_step>
            <_order>1</_order>
            <_item>
              <_task>{t('home.task.spellcasters')}</_task>
              <_actions>
                <AnimateButton low>
                  <_button onClick={() => visitCasters()}>
                    <IconHat />
                    <span>{t('visit.casters')}</span>
                  </_button>
                </AnimateButton>
              </_actions>
            </_item>
          </_step>
        )}
        {initialized && (
          <_step>
            <_order>2</_order>
            <_item>
              <_task $disabled>{t('home.task.map')}</_task>
              <_actions>
                <_button disabled $disabled onClick={() => visitMap()}>
                  <IconMap />
                  <span>{t('visit.map')}</span>
                </_button>
              </_actions>
            </_item>
          </_step>
        )}
        {initialized && (
          <_step>
            <_order>3</_order>
            <_item>
              <_task $disabled>{t('home.task.actions')}</_task>
              <_actions>
                <_button disabled $disabled onClick={() => visitCasters()}>
                  <IconHat />
                  <span>{t('visit.casters')}</span>
                </_button>
              </_actions>
            </_item>
          </_step>
        )}
      </_feed>
    </_home>
  );
};

export default Dashboard;
