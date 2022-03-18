import React, {
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
  useEffect,
} from 'react';
import {
  _game,
  _container,
  _mobile,
  _screen,
  _view,
  _download,
  _dots,
  _app_store,
  _store,
  _settings,
  _fetching,
} from './Game.styled';
import Nav from './nav/Nav';
import { useParams } from 'react-router-dom';
import Spellcasters from './spellcasters/Spellcasters';
import {
  VIEW_SPELLCASTERS,
  VIEW_MAP,
  VIEW_INVENTORY,
  PUBLIC_HOME,
  VIEW_HOME,
  VIEW_MARKET,
} from 'core/routes/routes';
import Map from './map/Map';
import Market from './market/Market';
import Inventory from './inventory/Inventory';
import Drawer from '../../shared/drawer/Drawer';
import { useSize } from 'core/hooks/useSize';
import Header from './header/Header';
import { useMobileHeight } from 'core/hooks/useMobileHeight';
import { AnimateMobile } from './animations/AnimateMobile';
import Dashboard from './home/Dashboard';
import { IconMore } from 'design/icons/more.icon';
import { Link } from 'react-router-dom';
import { IconApple } from 'design/icons/apple.icon';
import { IconAndroid } from 'design/icons/android.icon';
import Player from './spellcasters/drawer/Player';
import Modal from '../../shared/modal/Modal';
import { AnimateButton } from '../../shared/button/animations/AnimateButton';
import { useEventListener } from 'core/hooks/useEventListener';
import { AnimatePresence, domMax, LazyMotion, motion } from 'framer-motion';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useGame } from 'chain/hooks/useGame';
import {
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  DRAWER_CRAFT,
  DRAWER_INVENTORY,
  DRAWER_WALLET,
  DRAWER_SETTINGS,
  DRAWER_TOKENS,
  SETTINGS_ACTIVE,
  TOKENS_ACTIVE,
  UNEQUIP_ITEM,
  VIEW_SIZE,
  DRAWER_SPELLCASTER,
  VIEW_NAVIGATION,
} from 'core/remix/state';
import usePrevious from 'core/hooks/usePrevious';
import SettingsDrawer from '../../shared/settings/SettingsDrawer';
import { AnimateDots } from './animations/AnimateSettings';
import InventoryDrawer from './inventory/drawer/InventoryDrawer';
import TokensDrawer from '../../shared/tokens/TokensDrawer';
import { useActions } from '../../../actions';
import CraftDrawer from './inventory/drawer/craft/CraftDrawer';
import WalletDrawer from '../../shared/wallet/WalletDrawer';
import { useTranslation } from 'react-i18next';
import Mutations from '../../shared/mutations/Mutations';
import Connect from '../../shared/connect/Connect';

const Game = () => {
  const { t } = useTranslation();
  const [dh, setDrawerHeight] = useState();
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const { getGame } = useGame(client);
  const prevClient = usePrevious(client);
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const screen_ref = useRef();
  const { height } = useSize(screen_ref);
  const { vh } = useMobileHeight();
  const [view, setView] = useRemix(VIEW_NAVIGATION);
  const view_ref = useRef();
  const view_size = useSize(view_ref);
  const [, setViewHeight] = useRemix(VIEW_SIZE);
  const { openDrawerSettings } = useActions();

  useEffect(() => {
    if (!prevClient && client) {
      getGame(client);
    }
  }, [client]);

  useEffect(() => {
    if (view_size?.height) setViewHeight(view_size?.height);
  }, [view_size]);

  const refreshHeight = () => {
    let next_height = view_ref?.current?.offsetHeight;
    if (next_height && next_height !== dh) setDrawerHeight(next_height);
  };

  const Drawers = {
    [DRAWER_SETTINGS]: SettingsDrawer,
    [DRAWER_WALLET]: WalletDrawer,
    [DRAWER_TOKENS]: TokensDrawer,
    [DRAWER_INVENTORY]: InventoryDrawer,
    [DRAWER_CRAFT]: CraftDrawer,
    [DRAWER_SPELLCASTER]: Player,
  }[drawer?.type];

  const variants = {
    initial: {
      y: 8,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.25,
      },
    },
    exit: {
      y: 16,
      opacity: 0,
    },
  };

  const View = ({ children, $key }) => {
    return useMemo(
      () => (
        <motion.div {...variants} key={$key}>
          {children}
        </motion.div>
      ),
      [children],
    );
  };

  const animate_views = useMemo(
    () => (
      <AnimatePresence exitBeforeEnter>
        {!view || view === VIEW_HOME ? (
          <View key={'view-home'} $key={'view-home-motion'}>
            <Dashboard />
          </View>
        ) : null}
        {view === VIEW_INVENTORY && (
          <View key={'view-inventory'} $key={'view-inventory-motion'}>
            <Inventory />
          </View>
        )}
        {view === VIEW_SPELLCASTERS && (
          <View key={'view-spellcasters'} $key={'view-spellcasters-motion'}>
            <Spellcasters />
          </View>
        )}
        {view === VIEW_MAP && (
          <View key={'view-map'} $key={'view-map-motion'}>
            <Map />
          </View>
        )}
        {view === VIEW_MARKET && (
          <View key={'view-market'} $key={'view-market-motion'}>
            <Market />
          </View>
        )}
      </AnimatePresence>
    ),
    [view],
  );

  useLayoutEffect(() => refreshHeight(), []);
  useEventListener('resize', () => refreshHeight());
  useEventListener('scroll', () => refreshHeight());

  return (
    <_game $vh={vh}>
      <AnimateMobile $vh={vh}>
        <_mobile $vh={vh}>
          <_download>
            <Link to={PUBLIC_HOME}>
              <span>{t('laddercaster.title')}</span>
              <b>
                <span>{t('laddercaster.alpha')}</span>
              </b>
            </Link>
            <_dots>
              <Connect />
              <AnimateDots>
                <_settings onClick={() => openDrawerSettings()}>
                  <IconMore />
                </_settings>
              </AnimateDots>
            </_dots>
          </_download>
          <_fetching>
            <Mutations />
          </_fetching>
          <_screen ref={screen_ref}>
            <Modal screen_height={height} />
            <Header />
            <_view ref={view_ref}>
              <_container>
                <LazyMotion features={domMax}>{animate_views}</LazyMotion>
              </_container>
              <Drawer height={dh}>{Drawers ? <Drawers /> : null}</Drawer>
            </_view>
            <Nav />
          </_screen>
        </_mobile>
      </AnimateMobile>
    </_game>
  );
};

export default Game;
