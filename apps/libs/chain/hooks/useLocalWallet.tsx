import { useState, useCallback, useEffect } from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from './state';

//TODO: Replace with package once app is ready to ship
import { Client, Environment } from '../../sdk/src/laddercaster/program/Client';
import NodeWallet from 'sdk/src/laddercaster/utils/NodeWallet';

export const useLocalWallet = () => {
  const [client, setClient] = useRemix(CHAIN_LOCAL_CLIENT);
  const [error, setError] = useState();
  const [waiting, setWaiting] = useState(false);

  const request = useCallback(async () => {
    try {
      let localWallet = Client.getLocalKeypair();
      if (!localWallet) {
        localWallet = Client.generateKeypair();
      }
      setWaiting(true);
      const client = await Client.connect(
        new NodeWallet(localWallet),

        (process.env.REACT_APP_ENV as Environment) || 'localnet',
      );
      //TODO: Fix this function, it never works
      // await client.connection?.requestAirdrop(client.wallet.publicKey, 2*1e9);
      setWaiting(false);
      setError(null);
      setClient(client);
      } catch (error) {
      console.log(error)
      setWaiting(false);
      setError(error);
      setClient(null);
    }
  }, [setClient]);

  // Create a local wallet or use the existing one
  const createLocalWallet = useCallback(() => {
    setWaiting(true);
    return request();
  }, [request]);

  return {
    client,
    waiting,
    error,
    createLocalWallet,
  };
};
