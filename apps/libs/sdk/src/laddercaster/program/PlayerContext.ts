import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Caster, Client, Game, Item, ItemFeature, SLOTS_PUBKEY } from '.';
import * as anchor from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { deserializeUnchecked } from 'borsh';
import {
  AccountInfo,
  Keypair,
  ParsedAccountData,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import {
  MetadataData,
  Metadata,
  MetadataProgram,
} from '@metaplex-foundation/mpl-token-metadata';
import axios from 'axios';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
const { SystemProgram } = anchor.web3;

async function buildMerkleTree(): Promise<MerkleTree> {
  const merkelTree = await axios.get(
    'https://arweave.net/T1L0wI3oCt6exqSQIPK4bO0fYy24SHR5i9DAiK66c64',
  );

  return new MerkleTree(merkelTree.data, keccak256, {
    sortPairs: true,
    hashLeaves: true,
  });
}

async function axiosLookupTable() {
  const lookup = await axios.get(
    'https://arweave.net/WePRqJ0BtxIZnn3rM2f7VmxPqgrS8rcFk8rcHZw7txM',
  );

  return lookup.data;
}

let tree: MerkleTree = undefined;

async function getMerkleTree() {
  if (tree === undefined) {
    tree = await buildMerkleTree();
  }

  return tree;
}

let lookupTable: any = undefined;

async function getLookTable() {
  if (lookupTable === undefined) {
    lookupTable = await axiosLookupTable();
  }

  return lookupTable;
}

export type ResourcesPK = {
  gameAccount: string;
};

export class PlayerContext {
  constructor(
    private client: Client,
    private playerPubKey: anchor.web3.PublicKey,
    private gamePK: string,
  ) {}

  // INSTRUCTIONS
  async initPlayer() {
    const [gameAccount, playerAccount] = await this.getAccounts();

    return await this.client.program.rpc.initPlayer({
      accounts: {
        game: gameAccount,
        playerAccount: playerAccount,
        authority: this.playerPubKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [this.client.wallet.payer],
    });
  }

  private async getResource(publicKey: anchor.web3.PublicKey) {
    const tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      publicKey,
      this.client.wallet.publicKey,
    );

    try {
      const resourceAmount = await this.client.connection.getTokenAccountBalance(
        tokenAccount,
      );

      return resourceAmount.value.amount;
    } catch (_e) {
      return 0;
    }
  }

  async getResources() {
    const [, , , game] = await this.getAccounts();

    const pkArray = [
      game.resource1MintAccount,
      game.resource2MintAccount,
      game.resource3MintAccount,
      game.ladaMintAccount,
    ];

    const resourcesArray = [];

    for (let i = 0; i < pkArray.length; i++) {
      resourcesArray.push(
        await this.getResource(new anchor.web3.PublicKey(pkArray[i])),
      );
    }

    return {
      fire: resourcesArray[0],
      water: resourcesArray[1],
      earth: resourcesArray[2],
      lada: resourcesArray[3] / 1e9,
    };
  }

  async getInventory() {
    const [, playerAccount] = await this.getAccounts();

    const itemArray = (
      await this.client.program.account.item.all([
        {
          memcmp: {
            offset: 40,
            bytes: playerAccount.toBase58(),
          },
        },
      ])
    )
      .map((item) => {
        return { ...(item.account as Item), publicKey: item.publicKey };
      })
      .filter((item) => {
        return !item.equippedOwner;
      });

    return itemArray;
  }

  async getCasters() {
    const [, playerAccount] = await this.getAccounts();

    const casterArray = (
      await this.client.program.account.caster.all([
        { memcmp: { offset: 18, bytes: playerAccount.toBase58() } },
      ])
    ).map((caster) => {
      return { ...caster.account, publicKey: caster.publicKey };
    });

    return casterArray;
  }

  async getItem(itemPK: anchor.web3.PublicKey) {
    return await this.client.program.account.item.fetch(itemPK);
  }

  async initLadaAccount() {
    const [, , , game] = await this.getAccounts();
    const tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      game.ladaMintAccount,
      this.client.wallet.publicKey,
    );

    const tx = new Transaction();
    try {
      await this.client.connection.getTokenAccountBalance(tokenAccount);
    } catch (_e) {
      console.log('error', _e);
      tx.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          game.ladaMintAccount,
          tokenAccount,
          this.client.wallet.publicKey,
          this.client.wallet.publicKey,
        ),
      );
    }
    if (tx.instructions.length !== 0) {
      const blockhash = (await this.client.connection.getRecentBlockhash())
        .blockhash;
      tx.recentBlockhash = blockhash;
      tx.feePayer = this.client.wallet.publicKey;

      return await this.client.program.provider.send(tx);
    }
  }

  async getLadaAccountBalance() {
    const [, , , game] = await this.getAccounts();
    const tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      game.ladaMintAccount,
      this.client.wallet.publicKey,
    );
    try {
      return await this.client.connection.getTokenAccountBalance(tokenAccount);
    } catch (e) {
      console.log(e);
    }
  }

  async initCaster() {
    const [, playerAccount] = await this.getAccounts();

    return await this.client.program.rpc.initCaster({
      accounts: {
        playerAccount: playerAccount,
        authority: this.playerPubKey,
      },
    });
  }

  async openChest(chestItem: Item) {
    const [gameAccount, playerAccount] = await this.getAccounts();
    const item1 = Keypair.generate();
    const item2 = Keypair.generate();
    const item3 = Keypair.generate();
    return await this.client.program.rpc.openChest({
      accounts: {
        game: gameAccount,
        authority: this.playerPubKey,
        player: playerAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        chest: chestItem.publicKey,
        item1: item1.publicKey,
        item2: item2.publicKey,
        item3: item3.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [this.client.wallet.payer, item1, item2, item3],
    });
  }

  async manualResourceburn(
    casterId: anchor.BN,
    resourceType: ItemFeature,
    amountToBurn: anchor.BN,
  ) {
    const [gameAccount, playerAccount] = await this.getAccounts();
    return await this.client.program.rpc.manualResourceburn(
      casterId,
      resourceType,
      amountToBurn,
      {
        accounts: {
          game: gameAccount,
          playerAccount: playerAccount,
          authority: this.playerPubKey,
        },
      },
    );
  }

  // https://github.com/NftEyez/sol-rayz/blob/main/packages/sol-rayz/src/getParsedNftAccountsByOwner.ts
  async getNFTS() {
    const {
      value: splAccounts,
    } = await this.client.connection.getParsedTokenAccountsByOwner(
      new PublicKey(this.client.wallet.publicKey),
      {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      },
    );

    const nftAccounts = splAccounts
      .filter((t) => {
        const amount = t.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
        const decimals = t.account?.data?.parsed?.info?.tokenAmount?.decimals;
        return decimals === 0 && amount >= 1;
      })
      .map((t) => {
        const address = t.account?.data?.parsed?.info?.mint;
        return new PublicKey(address);
      });

    const metadataAcountsAddressPromises = await Promise.allSettled(
      nftAccounts.map(MetadataProgram.findMetadataAccount),
    );

    const metadataAccounts = metadataAcountsAddressPromises
      .filter((result) => result && result.status === 'fulfilled')
      .map((p) => (p as PromiseFulfilledResult<[PublicKey, number]>)?.value[0]);

    const accountsRawMeta: (AccountInfo<
      Buffer | ParsedAccountData
    > | null)[] = (
      await this.client.connection.getMultipleAccountsInfo(metadataAccounts)
    ).filter((result) => result);

    if (!accountsRawMeta?.length || accountsRawMeta?.length === 0) {
      return [];
    }

    const accountsDecodedMeta = await Promise.allSettled(
      accountsRawMeta.map((accountInfo) =>
        deserializeUnchecked(
          MetadataData.SCHEMA,
          MetadataData,
          (accountInfo as AccountInfo<Buffer>)?.data,
        ),
      ),
    );

    const accountsFiltered = accountsDecodedMeta
      .filter((result) => result && result.status === 'fulfilled')
      .filter((t) => {
        const uri = (t as PromiseFulfilledResult<
          MetadataData
        >).value.data?.uri?.replace?.(/\0/g, '');
        return uri !== '' && uri !== undefined;
      })
      .map((result) => {
        return (result as PromiseFulfilledResult<MetadataData>)?.value;
      });

    return accountsFiltered;
  }

  private buildLeafCaster(caster: Caster) {
    return keccak256(
      `${this.getCasterUri(caster)}:caster:${caster.version}:${caster.level}`,
    );
  }

  private getCasterUri(caster: Caster) {
    return lookupTable['caster'][caster.version][caster.level];
  }

  private getItemUri(item: Item) {}

  private buildLeafItem(item: Item) {
    switch (Object.keys(item.itemType)[0]) {
      case 'equipment': {
        return keccak256(
          `https://z56zuhoab42ubghhlmi4plp2iuaupbpq6f7cnwlxj5jo3wkb.arweave.net/z32aHcAPNUCY_51sRx636RQFHhfDxfibZd09S7dl_BQ:${
            Object.keys(item.itemType.equipment.equipmentType)[0]
          }:${item.level}:${Object.keys(item.itemType.equipment.feature)[0]}:${
            Object.keys(item.itemType.equipment.rarity)[0]
          }:${item.itemType.equipment.value}`,
        );
      }
      case 'spellBook': {
        return keccak256(
          `https://z56zuhoab42ubghhlmi4plp2iuaupbpq6f7cnwlxj5jo3wkb.arweave.net/z32aHcAPNUCY_51sRx636RQFHhfDxfibZd09S7dl_BQ:spellbook:${
            item.level
          }:${Object.keys(item.itemType.spellBook.spell)[0]}:${
            Object.keys(item.itemType.spellBook.costFeature)[0]
          }:${Object.keys(item.itemType.spellBook.rarity)[0]}:${
            item.itemType.spellBook.cost
          }:${item.itemType.spellBook.value}`,
        );
      }
      case 'chest': {
        return keccak256(
          `https://z56zuhoab42ubghhlmi4plp2iuaupbpq6f7cnwlxj5jo3wkb.arweave.net/z32aHcAPNUCY_51sRx636RQFHhfDxfibZd09S7dl_BQ:chest:${item.level}:${item.itemType.chest.tier}`,
        );
      }
    }
  }

  async mintNFTCaster(caster: Caster) {
    const [
      gameAccount,
      playerAccount,
      ,
      ,
      gameSigner,
    ] = await this.getAccounts();
    const nftMintKeys = Keypair.generate();
    const [nftMetadata] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode('metadata')),
        nftMintKeys.publicKey.toBuffer(),
      ],
      this.client.program.programId,
    );
    const nftToken = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMintKeys.publicKey,
      this.playerPubKey,
    );
    const metaplexMetadataAccount = await Metadata.getPDA(
      nftMintKeys.publicKey,
    );
    await getLookTable();
    await getMerkleTree();
    //Merkle proof part
    const leaf = this.buildLeafCaster(caster);
    // noinspection TypeScriptValidateTypes
    const proof = tree.getProof(leaf);
    const validProof: Buffer[] = proof.map((p) => p.data);

    let signers = [nftMintKeys];
    if (this.client.wallet.payer) {
      signers = [this.client.wallet.payer, ...signers];
    }
    const result = await this.client.program.rpc.mintCaster(
      this.getCasterUri(caster),
      validProof,
      {
        accounts: {
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
          authority: this.playerPubKey,
          game: gameAccount,
          gameSigner: gameSigner,
          player: playerAccount,
          caster: caster.publicKey,
          metaplexMetadataAccount: metaplexMetadataAccount,
          metaplexTokenMetadataProgram: MetadataProgram.PUBKEY,
          nftMint: nftMintKeys.publicKey,
          nftToken: nftToken,
          nftMetadata: nftMetadata,
        },
        signers,
      },
    );

    return result;
  }

  async mintNFTItem(item: Item) {
    const [
      gameAccount,
      playerAccount,
      ,
      ,
      gameSigner,
    ] = await this.getAccounts();
    const nftMintKeys = Keypair.generate();
    const [nftMetadata] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode('metadata')),
        nftMintKeys.publicKey.toBuffer(),
      ],
      this.client.program.programId,
    );
    const nftToken = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMintKeys.publicKey,
      this.playerPubKey,
    );
    const metaplexMetadataAccount = await Metadata.getPDA(
      nftMintKeys.publicKey,
    );
    //Merkle proof part
    const leaf = this.buildLeafItem(item);
    // noinspection TypeScriptValidateTypes
    await getLookTable();
    await getMerkleTree();
    const proof = tree.getProof(leaf);
    const validProof: Buffer[] = proof.map((p) => p.data);

    let signers = [nftMintKeys];
    if (this.client.wallet.payer) {
      signers = [this.client.wallet.payer, ...signers];
    }
    const result = await this.client.program.rpc.mintItem(
      `https://z56zuhoab42ubghhlmi4plp2iuaupbpq6f7cnwlxj5jo3wkb.arweave.net/z32aHcAPNUCY_51sRx636RQFHhfDxfibZd09S7dl_BQ`,
      validProof,
      {
        accounts: {
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
          authority: this.playerPubKey,
          game: gameAccount,
          gameSigner: gameSigner,
          player: playerAccount,
          item: item.publicKey,
          metaplexMetadataAccount: metaplexMetadataAccount,
          metaplexTokenMetadataProgram: MetadataProgram.PUBKEY,
          nftMint: nftMintKeys.publicKey,
          nftToken: nftToken,
          nftMetadata: nftMetadata,
        },
        signers,
      },
    );

    return result;
  }

  async getNFTUris(nfts: MetadataData[]) {
    var data = Object.keys(nfts).map((key) => nfts[key]);
    let arr = [];
    let n = data.length;
    for (let i = 0; i < n; i++) {
      let val = await axios.get(data[i].data.uri);
      arr.push({ ...val, mint: data[i].mint });
    }

    return arr;
  }

  async redeemNFT(nftMintKeys: PublicKey) {
    const [gameAccount, playerAccount] = await this.getAccounts();
    const [nftMetadata, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode('metadata')),
        nftMintKeys.toBuffer(),
      ],
      this.client.program.programId,
    );

    const nftToken = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      nftMintKeys,
      this.playerPubKey,
    );

    const newItem = Keypair.generate();

    let signers = [newItem];
    if (this.client.wallet.payer) {
      signers = [this.client.wallet.payer, ...signers];
    }

    return await this.client.program.rpc.redeemItem({
      accounts: {
        game: gameAccount,
        item: newItem.publicKey,
        nftMint: nftMintKeys,
        nftToken: nftToken,
        nftMetadata: nftMetadata,
        player: playerAccount,
        authority: this.playerPubKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
      signers,
    });
  }

  //EVENTS

  // FETCH
  async getPlayer() {
    const [, playerAccount] = await this.getAccounts();
    return await this.client.program.account.player.fetch(playerAccount);
  }

  private async getAccounts(): Promise<
    [PublicKey, PublicKey, number, Game, PublicKey]
  > {
    const gameAccount = new anchor.web3.PublicKey(this.gamePK);
    const [playerAccount, playerBump] = findProgramAddressSync(
      [gameAccount.toBuffer(), this.playerPubKey.toBuffer()],
      this.client.program.programId,
    );
    const game = (await this.client.program.account.game.fetch(
      gameAccount,
    )) as Game;

    const [gameSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('game_signer')],
      this.client.program.programId,
    );

    return [gameAccount, playerAccount, playerBump, game, gameSigner];
  }
}
