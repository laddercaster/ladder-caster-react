import React, { useEffect, useState } from 'react';
import { IconGoogle } from 'design/icons/google.icon';
import { useTranslation } from 'react-i18next';
import { _google } from '../../views/game/header/Header.styled';
import OpenLogin from '@toruslabs/openlogin';
import { getED25519Key } from '@toruslabs/openlogin-ed25519';
import { useLocation } from 'react-router-dom';
import { Keypair } from '@solana/web3.js';
import { useAdapterWallet } from 'chain/hooks/useAdapterWallet';
import NodeWallet from 'sdk/src/laddercaster/utils/NodeWallet';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CREATE_MUTATION, WALLET_AUTO_CONNECT } from 'core/remix/state';
import { nanoid } from 'nanoid';

export const TorusButton = () => {
  const { t } = useTranslation();
  const [, setLoading] = useState(false);
  const [, setMutation] = useRemix(CREATE_MUTATION);
  const location = useLocation();
  const [sdk, setSdk] = useState();
  const { createClient } = useAdapterWallet();

  const getSolanaPrivateKey = (openloginKey: string) => {
    const { sk } = getED25519Key(openloginKey);
    return sk;
  };

  const getAccountInfo = async (solanaPrivateKey) => {
    const account = Keypair.fromSecretKey(solanaPrivateKey);
    createClient(new NodeWallet(account));
  };

  useEffect(() => {
    const id = nanoid();
    setLoading(true);
    setMutation({
      id,
      rpc: true,
      validator: false,
      success: false,
      error: false,
      type: WALLET_AUTO_CONNECT
    });

    const sdkInstance = new OpenLogin({
      uxMode: 'popup',
      clientId:
        'BPQKJdLG2ghikI4O3GH-7yr0Y9-q8rGP-s0q2UMw0HvzUlIYEBYngIPGMOV6Lzkocdae_WE5UlFcjbqYn_iHNzA',
      network: 'testnet',
    });
    async function initializeOpenlogin() {
      await sdkInstance.init();
      setSdk(sdkInstance);
      setMutation({
        id,
        rpc: true,
        validator: false,
        done: true,
        success: true,
        error: false,
        type: WALLET_AUTO_CONNECT
      });
      setLoading(false);
    }
    initializeOpenlogin();
  }, []);

  const handleLogin = async () => {
    // privKey will be returned here only in case of popup mode or in case user is already logged in.
    // for redirect mode login, private key will be returned as `openlogin.privKey` after openlogin
    // is initialized using `init` function on successfully login redirect.
    const loginObj = await sdk.login({
      loginProvider: 'google',
      redirectUrl: `${window.origin}${location.pathname}`,
    });
    const id = nanoid();
    setMutation({
      id,
      rpc: true,
      validator: false,
      success: false,
      error: false,
      type: WALLET_AUTO_CONNECT
    });
    await getAccountInfo(getSolanaPrivateKey(loginObj.privKey));
    setMutation({
      id,
      rpc: true,
      validator: false,
      done: true,
      success: true,
      error: false,
      type: WALLET_AUTO_CONNECT
    });
  };

  return (
    <_google onClick={() => handleLogin()}>
      <IconGoogle />
      <span>{t('home.google')}</span>
    </_google>
  );
};
