import React, { useState, useMemo } from 'react';
import {
  _settings,
  _body,
  _disconnect,
  _section,
} from './SettingsDrawer.styled';
import {
  _close,
  _float,
  _header,
  _icon,
  _title,
  _actions,
  _button,
} from '../../views/game/inventory/drawer/craft/character/Character.styled';
import { AnimateButton } from '../button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DEMO_MODE, VIEW_SIZE } from 'core/remix/state';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { useTranslation } from 'react-i18next';
import { AnimateDots } from '../../views/game/animations/AnimateSettings';
import { useActions } from '../../../actions';
import ManageKey from './ManageKey';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

const MENU_EXPORT_SECRET_KEY = 'MENU_EXPORT_SECRET_KEY';
const MENU_EXPORT_PUBLIC_KEY = 'MENU_EXPORT_PUBLIC_KEY';

const SettingsDrawer = () => {
  const { t } = useTranslation();
  const [demo] = useRemix(DEMO_MODE);
  const [view_height] = useRemix(VIEW_SIZE);
  const {
    closeDrawer,
    testGiveLADA,
    testInitCaster,
    testGiveChest,
    testGiveResources,
    testGiveHat,
    testGiveRobe,
    testGiveStaff,
    testGiveSpell,
    testRefresh,
  } = useActions();
  const [activeMenu, setActiveMenu] = useState(null);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);

  const { secretKey, publicKey } = useMemo(() => {
    const { secretKey = null, publicKey = null } =
      client?.wallet?.payer?._keypair || {};

    return {
      secretKey: secretKey ? bs58.encode(secretKey) : '',
      publicKey: publicKey ? bs58.encode(publicKey) : '',
    };
  }, [client]);

  if (activeMenu === MENU_EXPORT_SECRET_KEY && secretKey)
    return (
      <ManageKey
        hasWarning
        hasBlur
        title={t('drawer.settings.key.export.secret')}
        type={t('drawer.settings.key.type.secret').toLocaleLowerCase()}
        keyValue={secretKey}
        close={() => setActiveMenu(null)}
      />
    );
  else if (activeMenu === MENU_EXPORT_PUBLIC_KEY && publicKey)
    return (
      <ManageKey
        title={t('drawer.settings.key.share.public')}
        type={t('drawer.settings.key.type.public').toLocaleLowerCase()}
        keyValue={publicKey}
        close={() => setActiveMenu(null)}
      />
    );

  return (
    <_settings $height={view_height}>
      <_header>
        <_title>{t('drawer.settings.title')}</_title>
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
        <_actions>
          {!demo && (
            <>
              {publicKey && (
                <_button onClick={() => setActiveMenu(MENU_EXPORT_PUBLIC_KEY)}>
                  {t('drawer.settings.key.share.public')}
                </_button>
              )}
              {secretKey && (
                <_button onClick={() => setActiveMenu(MENU_EXPORT_SECRET_KEY)}>
                  {t('drawer.settings.key.export.secret')}
                </_button>
              )}
              <_button onClick={() => testGiveLADA()}>Test Give LADA</_button>
              <_button onClick={() => testInitCaster()}>Create Caster</_button>
              <_button onClick={() => testGiveChest()}>Test Give Chest</_button>
              <_button onClick={() => testGiveResources()}>
                Test Give Resources
              </_button>
              <_button onClick={() => testGiveHat()}>Test Give Hat</_button>
              <_button onClick={() => testGiveRobe()}>Test Give Robe</_button>
              <_button onClick={() => testGiveStaff()}>Test Give Staff</_button>
              <_button onClick={() => testGiveSpell()}>Test Give Spell</_button>
              <_button onClick={() => testRefresh()}>Refresh</_button>
            </>
          )}
        </_actions>
        <AnimateDots>
          <_disconnect onClick={() => closeDrawer()}>
            {t('drawer.settings.disconnect')}
          </_disconnect>
        </AnimateDots>
      </_body>
    </_settings>
  );
};

export default SettingsDrawer;
