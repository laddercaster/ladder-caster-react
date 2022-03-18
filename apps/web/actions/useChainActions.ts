import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_ACTIVE,
  DRAWER_WALLET,
  DRAWER_SETTINGS,
  DRAWER_TOKENS,
  DRAWER_INVENTORY,
  DRAWER_CRAFT,
  DRAWER_CONTEXT,
  GAME_INVENTORY,
  GAME_CONFIRM,
  MODAL_ACTIVE,
  MODAL_CHEST,
  MODAL_MINT,
  MODAL_IMPORT,
  MODAL_CRAFT,
  MODAL_LOOT,
  MODAL_MOVE,
  MODAL_SPELL,
  PLAYER_ACTIONS,
  PLAYER_CHARACTER,
  TABS_CHARACTER_ACTIONS,
  EQUIP_ITEM,
  UNEQUIP_ITEM,
  MODAL_REDEEM,
  GAME_RESOURCES,
  TOKENS_ACTIVE,
  GAME_BOOST,
  TYPE_FIRE,
  TYPE_WATER,
  TYPE_EARTH,
  GAME_SPELLCASTERS,
  CREATE_MUTATION,
  DRAWER_SPELLCASTER,
  CRAFT_MATERIALS,
  USER_PHASE,
  PHASE_ACTIONS,
  PHASE_EQUIP,
  PHASE_REWARDS,
  CRAFT_ITEM,
  CRAFT_CHARACTER,
  VIEW_NAVIGATION,
} from 'core/remix/state';
import { TAB_REDEEM, TAB_WALLET, TABS_MINT_REDEEM } from 'core/remix/tabs';
import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_PLAYER,
  CHAIN_LADA_ACCOUNT,
} from 'chain/hooks/state';
import { nanoid } from 'nanoid';
import { find } from 'lodash';
import { VIEW_SPELLCASTERS, VIEW_MAP } from 'core/routes/routes';
import { useTranslation } from 'react-i18next';
import {
  CasterContext,
  GameContext,
  PlayerContext,
} from 'sdk/src/laddercaster/program';
import * as anchor from '@project-serum/anchor';
import {
  GIVE_ITEM,
  GIVE_LADA,
  GIVE_RESOURCES,
  INST_INIT_PLAYER,
  INST_INIT_LADA_ACCOUNT,
  INST_COMMIT_CRAFT,
  INST_COMMIT_LOOT,
  INST_COMMIT_MOVE,
  INST_COMMIT_SPELL,
  INST_CRANK,
  INST_EQUIP,
  INST_INIT_CASTER,
  INST_MANUAL_RES_BURN,
  INST_MINT_NFT,
  INST_OPEN_CHEST,
  INST_REDEEM_ACTION,
  INST_UNEQUIP,
  RPC_ERROR,
  RPC_LOADING,
} from 'core/remix/rpc';
import { INIT_STATE_BOOST, INIT_STATE_REDEEM } from 'core/remix/init';
import { useLocalWallet } from 'chain/hooks/useLocalWallet';

export const useChainActions = () => {
  const { t } = useTranslation();
  const [, setCasterTab] = useRemix(TABS_CHARACTER_ACTIONS);
  const [, setWalletTab] = useRemix(TABS_MINT_REDEEM);
  const [modal, setModal] = useRemix(MODAL_ACTIVE);
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const [context, setContext] = useRemix(DRAWER_CONTEXT);
  const [, setPhase] = useRemix(USER_PHASE);
  const [, setEquip] = useRemix(EQUIP_ITEM);
  const [, setUnequip] = useRemix(UNEQUIP_ITEM);
  const [confirm, setConfirm] = useRemix(GAME_CONFIRM);
  const [mutation, setMutation] = useRemix(CREATE_MUTATION);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [, setPlayer] = useRemix(CHAIN_PLAYER);
  const [game, setGame] = useRemix(CHAIN_GAME);
  const [items, setItems] = useRemix(CHAIN_ITEMS);
  const [casters, setCasters] = useRemix(CHAIN_CASTERS);
  const [, setLadaAccount] = useRemix(CHAIN_LADA_ACCOUNT);
  const [resources, setResources] = useRemix(GAME_RESOURCES);
  const [spellcasters, setSpellcasters] = useRemix(GAME_SPELLCASTERS);
  const [boost, setBoost] = useRemix(GAME_BOOST);
  const [inventory, setInventory] = useRemix(GAME_INVENTORY);
  const [tokens, setTokens] = useRemix(TOKENS_ACTIVE);
  const [loading, setLoading] = useRemix(RPC_LOADING);
  const [error, setError] = useRemix(RPC_ERROR);
  const { createLocalWallet } = useLocalWallet();
  const [view, setView] = useRemix(VIEW_NAVIGATION);

  const stateHandler = async (rpcCallback, type) => {
    const id = nanoid();

    try {
      setMutation({
        id,
        rpc: true,
        validator: false,
        success: false,
        error: false,
        type,
      });

      const validatorSignature = await rpcCallback();

      setMutation({
        id,
        rpc: false,
        validator: true,
        success: false,
        error: false,
        type,
      });

      const confirmationResult = await client.connection.confirmTransaction(
        validatorSignature,
      );

      const e = confirmationResult?.value?.err;

      // console.log('type', typeof e);

      setMutation({
        id,
        rpc: false,
        validator: false,
        success: !e,
        error: !!e,
        type,
        text: {
          error: typeof e === 'string' ? e : '',
        },
      });

      return confirmationResult;
    } catch (e) {
      console.log(e);
      setMutation({
        id,
        rpc: false,
        validator: false,
        success: false,
        error: true,
        text: {
          error: String(e),
        },
        type,
      });
    }
  };

  const fetchPlayer = async (preInstructionsCallback) => {
    const result = await preInstructionsCallback();
    if (result && !result?.value?.err) {
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

      setPlayer(await playerContext.getPlayer());
      setResources(await playerContext.getResources());
      setItems(await playerContext.getInventory());
      setCasters(await playerContext.getCasters());
    } else {
      //TODO: display user error from blockchain
    }
  };

  const fetchGame = async (preInstructionsCallback) => {
    const result = await preInstructionsCallback();
    if (!result.value.err) {
      const gameContext = new GameContext(
        client,
        localStorage.getItem('gamePK'),
      );
      setGame(await gameContext.getGameAccount());
    } else {
      //TODO: display user error from blockchain
    }
  };

  const createCasterContext = () => {
    return new CasterContext(
      client,
      client?.program?.provider?.wallet?.publicKey,
      localStorage.getItem('gamePK'),
    );
  };

  return {
    startDemo() {},
    closeDrawer() {
      setDrawer('');
      setEquip('');
      setUnequip('');
      setContext('');
    },
    visitCasters() {
      setView(VIEW_SPELLCASTERS);
    },
    visitMap() {
      setView(VIEW_MAP);
    },
    tabActions(id) {
      setCasterTab(PLAYER_ACTIONS);
      setDrawer({ type: DRAWER_SPELLCASTER, id });
    },
    tabCharacter(id) {
      setCasterTab(PLAYER_CHARACTER);
      setDrawer({ type: DRAWER_SPELLCASTER, id });
    },
    modalClear() {
      setModal({});
      setDrawer('');
      setContext('');
      setConfirm({});
    },
    modalBuyLADA() {
      setModal({
        active: true,
        type: MODAL_MINT,
        description: t('modal.demo.description'),
        accept: async () => {
          const casterContext = new CasterContext(
            client,
            client?.program?.provider?.wallet?.publicKey,
            localStorage.getItem('gamePK'),
          );

          await fetchPlayer(async () => {
            return await stateHandler(async () => {
              return await casterContext.initCaster();
            }, INST_INIT_CASTER);
          });
        },
        deny: () => {
          setModal({});
        },
      });
    },
    modalImportKey() {
      setModal({
        active: true,
        type: MODAL_IMPORT,
        description: null,
        import: (inputValue) => {
          setModal({});
        },
        generate: () => {
          createLocalWallet();
          setModal({});
        },
      });
    },
    async nextTurn() {
      await fetchGame(async () => {
        return await stateHandler(async () => {
          setPhase(PHASE_REWARDS);
          return await new GameContext(
            client,
            localStorage.getItem('gamePK'),
          ).crank();
        }, INST_CRANK);
      });
    },
    modalLoot(caster) {
      setModal({
        active: true,
        type: MODAL_LOOT,
        options: { caster },
        success: caster?.last_loot === game?.turnInfo?.turn,
      });
    },
    modalSpell(caster) {
      setModal({
        active: true,
        type: MODAL_SPELL,
        options: { caster },
        success: caster?.last_spell === game?.turnInfo?.turn,
      });
    },
    modalMove(caster) {
      setModal({
        active: true,
        type: MODAL_MOVE,
        options: { caster },
        success: caster?.last_move === game?.turnInfo?.turn,
      });
    },
    modalRedeem(caster) {
      setModal({
        active: true,
        type: MODAL_REDEEM,
        options: { caster },
      });
    },
    modalCraft(caster) {
      setDrawer({ type: DRAWER_CRAFT });
      setContext({ type: CRAFT_ITEM, caster });
    },
    actionMove(action) {
      setConfirm(action);
    },
    cancelMove() {
      setConfirm({});
    },
    async confirmChest(chest) {
      await fetchPlayer(async () => {
        return await stateHandler(async () => {
          return await new PlayerContext(
            client,
            client?.program?.provider?.wallet?.publicKey,
            localStorage.getItem('gamePK'),
          ).openChest(items[chest.index]);
        }, INST_OPEN_CHEST);
      });

      setModal('');
      setDrawer('');
      setContext('');
      setConfirm({});
    },
    actionCraft() {},
    actionSpell() {},
    chooseEquip(item) {
      setEquip(item);
    },
    chooseUnequip(item, caster) {
      setDrawer(item);
      setUnequip({
        caster,
        item,
      });
    },
    modalChest() {
      setModal({
        active: true,
        type: MODAL_CHEST,
      });
    },
    async actionLoot(caster) {
      if (caster?.last_loot < game?.turnInfo?.turn) {
        const casterContext = new CasterContext(
          client,
          client.program.provider.wallet.publicKey,
          localStorage.getItem('gamePK'),
          casters[caster.index],
        );

        setModal('');
        setDrawer('');
        setContext('');

        await fetchPlayer(async () => {
          return await stateHandler(async () => {
            return await casterContext.casterCommitLoot();
            // return await casterContext.changeTile();
          }, INST_COMMIT_LOOT);
        });
      }
    },
    async confirmMove(caster) {
      setModal('');
      setDrawer('');
      setContext('');
      await fetchPlayer(async () => {
        const [col, row] = confirm?.position.split('');

        return await stateHandler(async () => {
          return await new CasterContext(
            client,
            client.program.provider.wallet.publicKey,
            localStorage.getItem('gamePK'),
            casters[caster.index],
          ).casterCommitMove(
            row - 1,
            ['a', 'b', 'c'].findIndex((colLetter) => colLetter === col),
          );
        }, INST_COMMIT_MOVE);
      });
    },
    async actionRedeem(caster) {
      const casterContext = new CasterContext(
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
        casters[caster.index],
      );

      setModal('');
      setDrawer('');
      setContext('');

      await fetchPlayer(async () => {
        return await stateHandler(async () => {
          return await casterContext.casterRedeemAction();
        }, INST_REDEEM_ACTION);
      });
    },
    async equipItem(item, caster) {
      const casterContext = new CasterContext(
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
        casters[caster.index],
      );

      setModal('');
      setDrawer('');
      setContext('');

      await fetchPlayer(async () => {
        return await stateHandler(async () => {
          return await casterContext.equipItem(items[item.id]);
        }, INST_EQUIP);
      });
    },
    async unequipItem(item, caster) {
      try {
        const casterContext = new CasterContext(
          client,
          client.program.provider.wallet.publicKey,
          localStorage.getItem('gamePK'),
          casters[caster.index],
        );

        setModal('');
        setDrawer('');
        setContext('');
        setEquip('');
        setUnequip('');

        await fetchPlayer(async () => {
          return await stateHandler(async () => {
            return await casterContext.unequipItem(
              casters[caster.index].modifiers?.[item.type],
            );
          }, INST_UNEQUIP);
        });
      } catch (e) {
        // console.log(e);
      }
    },
    async castSpell(spell, caster) {
      const casterContext = new CasterContext(
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),

        casters[caster.index],
      );

      setContext('');
      setDrawer('');
      setEquip('');
      setUnequip('');

      await fetchPlayer(async () => {
        return await stateHandler(async () => {
          return await casterContext.castSpell(items[spell.id]);
        }, INST_COMMIT_SPELL);
      });
    },
    async craftChooseCharacter(caster) {
      setContext({ ...context, type: CRAFT_ITEM, caster });
    },
    async craftChooseItem(item) {
      setContext({ ...context, type: CRAFT_MATERIALS, item });
    },
    async craftChooseMaterials(item) {
      let materials = context?.materials || [];

      for (let i = 0; i < 3; i++) {
        if (!materials[i]) {
          materials[i] = item;
          break;
        }
      }

      setContext({ ...context, materials });
    },
    async removeMaterials(index) {
      let materials = context?.materials || [];
      let type = context?.type;
      materials[index] = null;

      if (!materials[0] || !materials[1] || !materials[2]) {
        type = CRAFT_MATERIALS;
      }
      setContext({ ...context, type, materials });
    },
    async craftItem() {
      const materials = context?.materials || [];
      const caster = context?.caster;
      const casterContext = new CasterContext(
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
        casters[caster.index],
      );

      setDrawer('');
      setModal('');
      setContext('');

      await fetchPlayer(async () => {
        return await stateHandler(async () => {
          return await casterContext.casterCommitCraft(
            items[materials[0].id],
            items[materials[1].id],
            items[materials[2].id],
          );
        }, INST_COMMIT_CRAFT);
      });
    },
    async decrementResource() {
      const amount = tokens?.amount;
      if (amount >= 1) setTokens({ ...tokens, amount: amount - 1 });
    },
    async incrementResource() {
      const amount = tokens?.amount;
      const flip = tokens?.flip;
      const input = tokens?.pair?.split('/')?.[!flip ? 0 : 1];
      const input_amount = resources?.[input];
      if (amount < input_amount) setTokens({ ...tokens, amount: amount + 1 });
    },
    async boostXP() {
      if (!drawer?.boost) {
        setDrawer({
          ...drawer,
          boost: true,
        });
      }
      setContext(INIT_STATE_BOOST);
    },
    async decrementXP(element) {
      let amount = context?.[element];
      if (amount >= 1) amount--;
      setContext({
        ...context,
        [element]: amount,
      });
    },
    async incrementXP(element) {
      let amount = context?.[element];
      let max_amount = resources?.[element];
      if (amount < max_amount)
        setContext({
          ...context,
          [element]: amount + 1,
        });
    },
    async burnResourcesForXP() {
      const caster = find(spellcasters, (caster) => caster.id === drawer?.id);
      const casterContext = new CasterContext(
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
        casters[caster.index],
      );

      const resources = [
        {
          itemFeature: { fire: {} },
          amount: context?.[TYPE_FIRE],
        },
        {
          itemFeature: { water: {} },
          amount: context?.[TYPE_WATER],
        },
        {
          itemFeature: { earth: {} },
          amount: context?.[TYPE_EARTH],
        },
      ];

      setContext(INIT_STATE_BOOST);
      setDrawer('');
      setModal('');

      await fetchPlayer(async () => {
        let result;
        for (let i = 0; i < resources.length; i++) {
          if (resources[i].amount) {
            result = await stateHandler(async () => {
              return await casterContext.manualResourceBurn(
                resources[i].itemFeature,
                resources[i].amount,
              );
            }, INST_MANUAL_RES_BURN);
          }
        }
        return result;
      });
    },
    async updateCasterLevel(caster) {},
    async openDrawerWallet() {
      setDrawer({ type: DRAWER_WALLET });
      setWalletTab(TAB_WALLET);
      setContext(INIT_STATE_REDEEM);
    },
    async openDrawerRedeem() {
      setDrawer({ type: DRAWER_WALLET });
      setWalletTab(TAB_REDEEM);
      setContext(INIT_STATE_REDEEM);
    },
    async openDrawerSettings() {
      setDrawer({ type: DRAWER_SETTINGS });
    },
    async openDrawerTokens() {
      setDrawer({ type: DRAWER_TOKENS });
    },
    async openDrawerInventory(item) {
      setDrawer({ type: DRAWER_INVENTORY });
      setContext({ ...inventory, item });
    },
    async openDrawerCraft() {
      setDrawer({ type: DRAWER_CRAFT });
      setContext({ type: CRAFT_CHARACTER });
    },
    async chooseRedeem(nft) {
      setContext({ ...context, nft });
    },
    async confirmRedeem() {
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

      setDrawer('');
      setContext({});
      setModal('');

      await fetchPlayer(async () => {
        return await stateHandler(async () => {
          return await playerContext.redeemNFT(
            new anchor.web3.PublicKey(context?.nft?.mint),
          );
        }, INST_MINT_NFT);
      });
    },
    async chooseMint(item) {
      setContext({ ...context, item });
    },
    async chooseMintCaster(caster) {
      setContext({ ...context, caster });
    },
    async confirmMint() {
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

      setModal('');
      setDrawer('');
      setContext({});

      if (context?.caster) {
        await fetchPlayer(async () => {
          return await stateHandler(async () => {
            return await playerContext.mintNFTCaster(
              casters[context?.caster?.index],
            );
          }, INST_MINT_NFT);
        });
      } else {
        await fetchPlayer(async () => {
          return await stateHandler(async () => {
            return await playerContext.mintNFTItem(
              items[context?.item?.id || context?.item?.index],
            );
          }, INST_MINT_NFT);
        });
      }
    },
    async testGiveLADA() {
      console.log('Give Lada');
      const casterContext = createCasterContext();

      await stateHandler(async () => {
        return await casterContext.giveLada();
      }, GIVE_LADA);
    },
    async testInitCaster() {
      console.log('Initialize Caster');
      const casterContext = createCasterContext();

      return await stateHandler(async () => {
        return await casterContext.initCaster();
      }, INST_INIT_CASTER);
    },
    async testGiveChest() {
      console.log('Give Chest');
      const casterContext = createCasterContext();

      await stateHandler(async () => {
        return await casterContext.giveItem({
          chest: {
            tier: new anchor.BN(1),
          },
        });
      }, GIVE_ITEM);
    },
    async testGiveResources() {
      console.log('Give Resources');
      const casterContext = createCasterContext();

      await stateHandler(async () => {
        return await casterContext.giveResources();
      }, GIVE_RESOURCES);
    },
    async testGiveHat() {
      console.log('Give Hat');
      const casterContext = createCasterContext();

      await stateHandler(async () => {
        return await casterContext.giveItem({
          equipment: {
            feature: { water: {} },
            rarity: { common: {} },
            equipmentType: { head: {} },
            value: new anchor.BN(1), // 8
          },
        });
      }, GIVE_ITEM);
    },
    async testGiveRobe() {
      console.log('Give Robe');
      const casterContext = createCasterContext();

      await stateHandler(async () => {
        return await casterContext.giveItem({
          equipment: {
            feature: { water: {} },
            rarity: { common: {} },
            equipmentType: { robe: {} },
            value: new anchor.BN(1), // 8
          },
        });
      }, GIVE_ITEM);
    },
    async testGiveStaff() {
      console.log('Give Staff');
      const casterContext = createCasterContext();

      await stateHandler(async () => {
        return await casterContext.giveItem({
          equipment: {
            feature: { water: {} },
            rarity: { common: {} },
            equipmentType: { staff: {} },
            value: new anchor.BN(1), // 8
          },
        });
      }, GIVE_ITEM);
    },
    async testGiveSpell() {
      console.log('Give Spell');
      const casterContext = createCasterContext();

      await stateHandler(async () => {
        return await casterContext.giveItem({
          spellBook: {
            spell: { fire: {} },
            costFeature: { fire: {} },
            rarity: { common: {} },
            /// 1-300
            cost: new anchor.BN(0), // 16
            /// 0-3.6k
            value: new anchor.BN(0), // 16
          },
        });
      }, GIVE_ITEM);
    },
    async testRefresh() {
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

      setPlayer(await playerContext.getPlayer());
      setResources(await playerContext.getResources());
      setItems(await playerContext.getInventory());
      setCasters(await playerContext.getCasters());
    },
    async initPlayer() {
      const playerContext = new PlayerContext(
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
      );

      await stateHandler(async () => {
        //Do not remove for testing
        console.log(client.program.provider.wallet.publicKey.toString());
        const result = await playerContext.initPlayer();
        setPlayer(await playerContext.getPlayer());
        return result;
      }, INST_INIT_PLAYER);
    },
    async initLadaAccount() {
      const playerContext = new PlayerContext(
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
      );

      await stateHandler(async () => {
        const result = await playerContext.initLadaAccount();
        setLadaAccount(await playerContext.getLadaAccountBalance());
        return result;
      }, INST_INIT_LADA_ACCOUNT);
    },
    async continueRewardsEquip() {
      setPhase(PHASE_EQUIP);
    },
    async continueEquipActions() {
      setPhase(PHASE_ACTIONS);
    },
  };
};
