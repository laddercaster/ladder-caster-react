import React from 'react';
import { _connect, _wallet } from './Connect.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DEMO_MODE } from 'core/remix/state';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { IconWallet } from '../../../../libs/design/icons/wallet.icon';
import AppStore from '../appstore/AppStore';
import { useActions } from '../../../actions';

const Connect = () => {
  const [demo] = useRemix(DEMO_MODE);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const { openDrawerWallet } = useActions();
  const publicKey = client?.wallet?.publicKey?.toBase58();
  const short_public = publicKey
    ? `...${publicKey?.substring(publicKey?.length - 6, publicKey?.length)}`
    : null;
  const active =
    client !== undefined ? client?.wallet?.publicKey?.toBase58() : demo?.active;

  return (
    <_connect>
      {active && short_public ? (
        <_wallet onClick={() => openDrawerWallet()}>
          <span>{short_public}</span>
          <IconWallet />
        </_wallet>
      ) : (
        <AppStore />
      )}
    </_connect>
  );
};

export default Connect;
