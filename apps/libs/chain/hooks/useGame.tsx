import { useState } from 'react';
import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_NFTS,
  CHAIN_PLAYER,
  CHAIN_LADA_ACCOUNT
} from './state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { Client } from '../../sdk/src/laddercaster/program/Client';
import { GameContext } from '../../sdk/src/laddercaster/program/GameContext';
import { PlayerContext } from '../../sdk/src/laddercaster/program';
import { GAME_RESOURCES } from 'core/remix/state';

export const useGame = () => {
  const [game, setGame] = useRemix(CHAIN_GAME);
  const [player, setPlayer] = useRemix(CHAIN_PLAYER);
  const [, setLadaAccount] = useRemix(CHAIN_LADA_ACCOUNT);
  const [, setNfts] = useRemix(CHAIN_NFTS);
  const [, setItems] = useRemix(CHAIN_ITEMS);
  const [, setCasters] = useRemix(CHAIN_CASTERS);
  const [, setResources] = useRemix(GAME_RESOURCES);
  const [error, setError] = useState();
  const [waiting, setWaiting] = useState(false);

  const request = async (client: Client) => {
    try {
      setWaiting(true);

      if (client) {
        const gameContext = new GameContext(
          client,
          localStorage.getItem('gamePK'),
        );
        setGame(await gameContext.getGameAccount());

        const playerContext = new PlayerContext(
          client,
          client.program.provider.wallet.publicKey,
          localStorage.getItem('gamePK'),
        );

        try {
          // setPlayer(await playerContext.getPlayer());
        } catch (e) {
          // console.log(e);
          //Prompt user if account doesnt exist or auto make it?
          // console.log(client.program.provider.wallet.publicKey.toBase58());
          await playerContext.initPlayer();
        }

        try {
          // await playerContext.initLadaAccount();
          setResources(await playerContext.getResources());
          setItems(await playerContext.getInventory());
          setCasters(await playerContext.getCasters());
          setNfts(
            await playerContext.getNFTUris(await playerContext.getNFTS()),
          );
        } catch (e) {
          console.log(e);
        }

        try{
          setPlayer(await playerContext.getPlayer());
          setLadaAccount(await playerContext.getLadaAccountBalance());

        }catch(e){
          console.log(e)
        }
      }
      setWaiting(false);
    } catch (e) {
      setWaiting(false);
      // console.log('error', e);
      setError(e);
    }
  };

  return {
    player,
    game,
    waiting,
    error,
    getGame: (program) => {
      setWaiting(true);
      return request(program);
    },
  };
};
