import React from 'react';
import { _nav, _item, _button } from './Nav.styled';
import {
  VIEW_SPELLCASTERS,
  VIEW_MAP,
  VIEW_HOME,
  VIEW_INVENTORY,
  VIEW_MARKET,
} from 'core/routes/routes';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DEMO_MODE, DRAWER_ACTIVE, VIEW_NAVIGATION } from 'core/remix/state';
import { IconMarketplace } from 'design/icons/marketplace.icon';
import { useLocation } from 'react-router-dom';
import { IconBag } from 'design/icons/bag.icon';
import { IconHat } from 'design/icons/hat.icon';
import { IconMap } from 'design/icons/map.icon';
import { IconHome } from 'design/icons/home.icon';
import { useTranslation } from 'react-i18next';
import { AnimateButton } from '../../../shared/button/animations/AnimateButton';

const Nav = () => {
  const { t } = useTranslation();
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const { pathname } = useLocation();
  const [view, setView] = useRemix(VIEW_NAVIGATION);

  return (
    <_nav>
      <_item
        onClick={() => {
          setView(VIEW_MARKET);
          setDrawer('');
        }}
      >
        <AnimateButton low active={view === VIEW_MARKET}>
          <_button $first $active={view === VIEW_MARKET}>
            <IconMarketplace />
            <span>{t('nav.market')}</span>
          </_button>
        </AnimateButton>
      </_item>
      <_item
        onClick={() => {
          setView(VIEW_INVENTORY);
          setDrawer('');
        }}
      >
        <AnimateButton low active={view === VIEW_INVENTORY}>
          <_button $active={view === VIEW_INVENTORY}>
            <IconBag />
            <span>{t('nav.bag')}</span>
          </_button>
        </AnimateButton>
      </_item>
      <_item
        onClick={() => {
          setView(VIEW_HOME);
          setDrawer('');
        }}
      >
        <AnimateButton low active={!view || view === VIEW_HOME}>
          <_button $active={!view || view === VIEW_HOME}>
            <IconHome />
            <span>{t('nav.home')}</span>
          </_button>
        </AnimateButton>
      </_item>
      <_item
        onClick={() => {
          setView(VIEW_SPELLCASTERS);
          setDrawer('');
        }}
      >
        <AnimateButton low active={view === VIEW_SPELLCASTERS}>
          <_button $active={view === VIEW_SPELLCASTERS}>
            <IconHat />
            <span>{t('nav.casters')}</span>
          </_button>
        </AnimateButton>
      </_item>
      <_item
        onClick={() => {
          setView(VIEW_MAP);
          setDrawer('');
        }}
      >
        <AnimateButton low active={view === VIEW_MAP}>
          <_button $last $active={view === VIEW_MAP}>
            <IconMap />
            <span>{t('nav.map')}</span>
          </_button>
        </AnimateButton>
      </_item>
    </_nav>
  );
};

export default Nav;
