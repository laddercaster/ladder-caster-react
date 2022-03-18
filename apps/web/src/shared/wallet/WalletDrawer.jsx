import React from 'react';
import { _wallet, _body } from './WalletDrawer.styled';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import { VIEW_SIZE } from 'core/remix/state';
import { useActions } from '../../../actions';
import {
  TAB_MINT,
  TAB_REDEEM,
  TAB_WALLET,
  TABS_MINT_REDEEM,
} from 'core/remix/tabs';
import RedeemTab from './tabs/redeem/tab/RedeemTab';
import {
  _close,
  _float,
  _header,
  _icon,
  _title,
} from '../../views/game/inventory/drawer/craft/character/Character.styled';
import { AnimateButton } from '../button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { _breakpoint } from '../../views/game/spellcasters/drawer/Player.styled';
import Tabs from '../tabs/Tabs';
import MintTab from './tabs/mint/tab/MintTab';

const WalletDrawer = () => {
  const { t } = useTranslation();
  const [view_height] = useRemix(VIEW_SIZE);
  const { closeDrawer } = useActions();

  const tabs_mint_redeem = {
    [TAB_WALLET]: {
      name: t('wallet.wallet'),
      View: RedeemTab,
    },
    [TAB_REDEEM]: {
      name: t('wallet.redeem'),
      View: RedeemTab,
    },
    [TAB_MINT]: {
      name: t('wallet.mint'),
      View: MintTab,
    },
  };

  return (
    <_wallet $height={view_height}>
      <_header>
        <_title>{t('drawer.wallet.title')}</_title>
        <_float>
          <_close>
            <AnimateButton high>
              <_icon onClick={() => closeDrawer()}>
                <IconClose />
              </_icon>
            </AnimateButton>
          </_close>
        </_float>
      </_header>
      <_body>
        <_breakpoint />
        <Tabs tab_id={TABS_MINT_REDEEM} views={tabs_mint_redeem} />
      </_body>
    </_wallet>
  );
};

export default WalletDrawer;
