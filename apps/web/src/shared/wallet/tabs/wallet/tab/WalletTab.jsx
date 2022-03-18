import React from 'react';
import { _tab } from './WalletTab.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';

const WalletTab = () => {
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const publicKey = client?.wallet?.publicKey?.toBase58();
  const short_public = publicKey
    ? `...${publicKey?.substring(publicKey?.length - 6, publicKey?.length)}`
    : null;

  return <_tab></_tab>;
};

export default WalletTab;
