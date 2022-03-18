import React, { useState } from 'react';
import {
  _settings,
  _body,
  _disconnect,
  _section,
  _button,
  _float,
  _item_container,
  _item,
  _text,
  _blur,
  _icon,
  _warning_container,
  _warning_title,
  _warning_subtitle,
} from './ManageKey.styled';
import {
  _close,
  _header,
  _title,
} from '../../views/game/inventory/drawer/craft/character/Character.styled';
import { AnimateButton } from '../button/animations/AnimateButton';
import { useRemix } from 'core/hooks/remix/useRemix';
import { VIEW_SIZE } from 'core/remix/state';
import { useTranslation } from 'react-i18next';
import { IconChevronLeft } from 'design/icons/chevron-left.icon';

const ManageKey = ({ close, keyValue, type, title, hasBlur, hasWarning }) => {
  const { t } = useTranslation();
  const [view_height] = useRemix(VIEW_SIZE);
  const [showKey, setShowKey] = useState(false);

  const copyToClipboard = () => {
    if (navigator?.clipboard) {
      navigator.clipboard
        .writeText(keyValue)
        .then(() => {
          console.log('copied!');
        })
        .catch(() => {
          console.log('could not copy!');
        });
    }
  };

  return (
    <_settings $height={view_height}>
      <_header>
        <_float>
          <_close>
            <AnimateButton high>
              <_icon onClick={() => close()}>
                <IconChevronLeft />
              </_icon>
            </AnimateButton>
          </_close>
        </_float>
        <_title>{title || t('drawer.settings.key.manage')}</_title>
      </_header>
      <_body>
        <_section onClick={() => setShowKey(!showKey)}>
          <_item_container>
            {!showKey && hasBlur && <_blur />}
            <_item>{keyValue}</_item>
          </_item_container>
          {hasBlur && <_text>{t('drawer.settings.key.tap', { type })}</_text>}
        </_section>
        <_section>
          {hasWarning && (
            <_warning_container>
              <_warning_title>
                {t('drawer.settings.key.warning.title', { type })}
              </_warning_title>
              <_warning_subtitle>
                {t('drawer.settings.key.warning.desc', { type })}
              </_warning_subtitle>
            </_warning_container>
          )}
          <_button onClick={() => copyToClipboard()}>
            {t('copy.clipboard')}
          </_button>
        </_section>
      </_body>
    </_settings>
  );
};

export default ManageKey;
