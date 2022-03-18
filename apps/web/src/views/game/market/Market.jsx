import React from 'react';
import {
  _market,
  _header,
  _title,
  _divider,
  _body,
  _fractal,
  _holaplex,
} from './Market.styled';
import { useTranslation } from 'react-i18next';
import { TicksInstance } from '../../../../App';
import { _controls, _speed } from '../header/Header.styled';
import { _wallet } from '../inventory/Inventory.styled';
import Wallet from '../../../shared/wallet/WalletHeader';
import { IconFractal } from '../../../../../libs/design/icons/fractal.icon';
import Heading from '../../../shared/heading/Heading';

const Market = () => {
  const { t } = useTranslation();

  return (
    <_market>
      <Heading title={t('title.market')} />
      <_body>
        <_holaplex>
          <span>👋</span>Holaplex
        </_holaplex>
        <_fractal>
          <IconFractal />
        </_fractal>
      </_body>
    </_market>
  );
};

export default Market;
