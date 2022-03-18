import { useRemixOrigin } from 'core/hooks/remix/useRemixOrigin';
import { useAutoSignIn } from 'core/hooks/useAutoSignIn';
import {
  EQUIP_ITEM,
  GAME_BOOST,
  GAME_CONFIRM,
  GAME_INVENTORY,
  GAME_MAP,
  GAME_OPTIONS,
  GAME_RESOURCES,
  GAME_SPELL,
  GAME_SPELLCASTERS,
  MODAL_ACTIVE,
  USER_OFFLINE,
  TABS_CHARACTER_ACTIONS,
  TOKENS_ACTIVE,
  TYPE_EARTH,
  TYPE_FIRE,
  TYPE_WATER,
  UNEQUIP_ITEM,
  CREATE_MUTATION,
  DRAWER_CONTEXT,
  VIEW_NAVIGATION,
  USER_PHASE,
} from 'core/remix/state';
import { COLUMNS_ALPHA, getTier } from 'core/utils/switch';
import { convertStrToRandom } from 'core/utils/numbers';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_NEXT_TURN,
  CHAIN_NFTS,
  CHAIN_PLAYER,
  CHAIN_LADA_ACCOUNT,
} from '../../../libs/chain/hooks/state';
import {
  Caster,
  Game,
  GameContext,
  Item,
  PlayerContext,
  ResourcesPK,
  Tile,
} from '../../../libs/sdk/src/laddercaster/program';
import * as anchor from '@project-serum/anchor';
import resources from 'sdk/src/laddercaster/config/resources.json';
import { RPC_ERROR, RPC_LOADING } from 'core/remix/rpc';
import { TAB_CHARACTER, TAB_WALLET, TABS_MINT_REDEEM } from 'core/remix/tabs';

const Remix = () => {
  const [, setMap] = useRemixOrigin(GAME_MAP);
  const [game, setGame] = useRemixOrigin(CHAIN_GAME);
  const [player] = useRemixOrigin(CHAIN_PLAYER);
  const [ladaAccount] = useRemixOrigin(CHAIN_LADA_ACCOUNT);
  const [items] = useRemixOrigin(CHAIN_ITEMS, []);
  const [casters] = useRemixOrigin(CHAIN_CASTERS, []);
  const [, setSpellcasters] = useRemixOrigin(GAME_SPELLCASTERS, []);
  const [, setInventory] = useRemixOrigin(GAME_INVENTORY, {
    items: [],
    chests: [],
    last_mint: 0,
  });
  useRemixOrigin(GAME_RESOURCES, {
    fire: 0,
    earth: 0,
    water: 0,
    lada: 0,
  });

  useRemixOrigin(USER_PHASE);
  useRemixOrigin(VIEW_NAVIGATION);
  useRemixOrigin(USER_OFFLINE);
  const [client] = useRemixOrigin(CHAIN_LOCAL_CLIENT);
  const [loading] = useRemixOrigin(RPC_LOADING, {});
  useRemixOrigin(DRAWER_CONTEXT, {});
  useRemixOrigin(RPC_ERROR, []);
  useRemixOrigin(CHAIN_NEXT_TURN);
  useRemixOrigin(CHAIN_NFTS, []);
  useRemixOrigin(CREATE_MUTATION);
  useRemixOrigin(EQUIP_ITEM, '');
  useRemixOrigin(UNEQUIP_ITEM, '');
  useRemixOrigin(MODAL_ACTIVE, {});
  useRemixOrigin(GAME_CONFIRM, {});
  useRemixOrigin(TABS_CHARACTER_ACTIONS, TAB_CHARACTER);
  useRemixOrigin(TABS_MINT_REDEEM, TAB_WALLET);
  useRemixOrigin(GAME_SPELL, {});
  useRemixOrigin(TOKENS_ACTIVE, '');
  useRemixOrigin(GAME_BOOST, {
    [TYPE_WATER]: 0,
    [TYPE_FIRE]: 0,
    [TYPE_EARTH]: 0,
  });

  // TODO: Remove! Only added for esthetics
  useRemixOrigin(GAME_OPTIONS, {
    base: 1200,
    speed: 120,
    reward: 10,
    bars: 3,
    land: 3,
  });

  const [requestCachePubKey] = useAutoSignIn();

  const init_land = (tile: Tile, row: number, col: number) => ({
    col,
    id: nanoid(),
    tier: getTier(row),
    empty: false,
    remaining: tile.life,
    level: row,
    cooldown: false,
    type: Object.keys(tile.tileType)[0],
  });

  const empty_land = (col: string, level: number) => ({
    col,
    id: nanoid(),
    level: level,
    empty: true,
  });

  const generateMap = (game: Game) => {
    const lands = [];
    const map = game.map;

    if (map) {
      for (let row = 0; row < map.length; row++) {
        let level: any = {};
        level.id = nanoid();
        level.level = row;

        for (let col = 0; col < map[row]?.length; col++) {
          const tileSearched = map[row][col];
          if (tileSearched)
            level[COLUMNS_ALPHA[col]] = init_land(tileSearched, row, col);
          else level[COLUMNS_ALPHA[col]] = empty_land(COLUMNS_ALPHA[col], row);
        }
        lands.push(level);
      }
    }

    return lands;
  };

  const generateSpellCaster = async (casterArr: Caster[]) => {
    let spellcastersArr = [];

    for (let i = 0; i < casterArr.length; i++) {
      const caster = casterArr[i];
      const position = `${COLUMNS_ALPHA[caster.modifiers.tileColumn]}${
        caster.modifiers.tileLevel + 1
      }`;

      const doneActions = {};

      let isMoveActionBefore = false;
      let isLootActionBefore = false;
      let moveAction = caster.turnCommit?.actions?.mv;

      //TODO need to check order

      // caster?.turnCommit?.actions.forEach((action) => {
      //   doneActions[Object.keys(action)[0]] = caster.turnCommit.turn.toNumber();

      //   if (Object.keys(action)[0] === 'move') {
      //     moveAction = action.move;
      //   }
      //   if (Object.keys(action)[0] === 'move' && !isLootActionBefore) {
      //     isMoveActionBefore = true;
      //   } else if (Object.keys(action)[0] === 'loot' && !isMoveActionBefore) {
      //     isLootActionBefore = true;
      //   }
      // });

      const currentTurn = game?.turnInfo?.turn;

      const generateModifier = async (itemPK: anchor.web3.PublicKey) => {
        let item: Item;
        try {
          const playerContext = new PlayerContext(
            client,
            client?.program?.provider?.wallet?.publicKey,
            localStorage.getItem('gamePK'),
          );

          item = (await playerContext.getItem(itemPK)) as Item;
        } catch (e) {
          item = null;
        }

        if (!item) return null;

        if (item?.itemType?.equipment) {
          return {
            type: Object.keys(item?.itemType?.equipment?.equipmentType)?.[0],
            id: 0,
            tier: getTier(item.level),
            level: item?.level,
            attribute: Object.keys(item?.itemType?.equipment?.feature)?.[0],
            rarity: Object.keys(item?.itemType?.equipment?.rarity)?.[0],
          };
        } else {
          return {
            type: Object.keys(item?.itemType)?.[0],
            id: 0,
            tier: getTier(item.level),
            level: item?.level,
            attribute: Object.keys(item?.itemType?.spellBook?.spell)?.[0],
            rarity: Object.keys(item?.itemType?.spellBook?.rarity)?.[0],
          };
        }
      };

      spellcastersArr.push({
        index: i,
        publicKey: caster?.publicKey?.toString(),
        hue: Math.floor(convertStrToRandom(caster?.publicKey?.toString(), 360)),
        casterActionPosition: moveAction
          ? `${COLUMNS_ALPHA[moveAction[1]]}${moveAction[0] + 1}`
          : null,
        turnCommit: caster?.turnCommit?.turn,
        isLootActionBefore,
        level: caster.level,
        position: position,
        id: nanoid(),
        xp: caster.experience.toNumber(),
        hat: await generateModifier(caster.modifiers.head),
        robe: await generateModifier(caster.modifiers.robe),
        staff: await generateModifier(caster.modifiers.staff),
        spell: await generateModifier(caster.modifiers.spellBook),
        last_loot: caster?.turnCommit?.actions?.loot
          ? currentTurn
          : currentTurn - 1,
        last_craft: caster?.turnCommit?.actions?.crafting
          ? currentTurn
          : currentTurn - 1,
        last_move: caster?.turnCommit?.actions?.mv
          ? currentTurn
          : currentTurn - 1,
        last_spell: caster?.turnCommit?.actions?.spell
          ? currentTurn
          : currentTurn - 1,
      });
    }
    return spellcastersArr;
  };

  const generateInventory = (inventory: Item[]) => {
    let items = [];
    let chests = [];

    inventory.forEach((item, key) => {
      if (Object.keys(item.itemType)[0] === 'chest') {
        chests.push({
          type: 'chest',
          index: key,
          tier: getTier(item.itemType.chest.tier),
          level: item.level,
        });
      } else {
        if (item.itemType.equipment) {
          items.push({
            type: Object.keys(item.itemType.equipment.equipmentType)[0],
            id: key,
            tier: getTier(item.level),
            level: item.level,
            attribute: Object.keys(item.itemType.equipment.feature)[0],
            rarity: Object.keys(item.itemType.equipment.rarity)[0],
          });
        } else if (item.itemType.spellBook) {
          items.push({
            type: Object.keys(item.itemType)[0],
            id: key,
            tier: getTier(item.level),
            level: item.level,
            attribute: Object.keys(item.itemType.spellBook.spell)[0],
            rarity: Object.keys(item.itemType.spellBook.rarity)[0],
            cost: item.itemType.spellBook.cost,
            costFeature: Object.keys(item.itemType.spellBook.costFeature)[0],
            value: item.itemType.spellBook.value,
          });
        }
      }
    });

    return { items, chests };
  };

  useEffect(() => {
    let listener;
    if (game) {
      setMap(generateMap(game));

      if (client) {
        listener = client.program.addEventListener('NewTurn', async () => {
          const gameContext = new GameContext(
            client,
            localStorage.getItem('gamePK'),
          );
          setGame(await gameContext.getGameAccount());
        });
      }
    }

    return () => {
      if (client) client.program.removeEventListener(listener);
    };
  }, [game]);

  const asyncSpellCaster = async () => {
    setSpellcasters(await generateSpellCaster(casters));
  };

  useEffect(() => {
    if (casters) {
      asyncSpellCaster();
    }
  }, [casters]);

  useEffect(() => {
    if (items) {
      setInventory(generateInventory(items));
    }
  }, [items]);

  useEffect(() => {
    requestCachePubKey();

    // DO NOT REMOVE, the game breaks if removed
    localStorage.setItem('gamePK', (resources as ResourcesPK).gameAccount);
  }, []);

  useEffect(() => {
    if (player) {
      console.log('player', player);
    }
  }, [player]);

  useEffect(() => {
    if (casters) {
      console.log('casters', casters);
    }
  }, [casters]);

  useEffect(() => {
    if (ladaAccount) {
      // console.log('ladaAccount', ladaAccount);
    }
  }, [ladaAccount]);

  useEffect(() => {
    if (loading) {
      Object.keys(loading).forEach((key) => {
        if (loading[key].rpc || loading[key].validator) {
          console.log(
            `${key} is loading ${loading[key].rpc ? 'rpc' : 'validator'}`,
          );
        }
      });
    }
  }, [loading]);

  return null;
};

export default Remix;
