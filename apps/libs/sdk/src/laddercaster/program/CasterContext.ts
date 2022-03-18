import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import {
  Caster,
  Client,
  Game,
  Item,
  ItemFeature,
  ItemType,
  ResourcesPK,
} from '.';
import * as anchor from '@project-serum/anchor';
import {
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export class CasterContext {
  constructor(
    private client: Client,
    private playerPubKey: anchor.web3.PublicKey,
    private gamePK: string,
    private caster?: Caster,
  ) {}

  // FETCH

  // INSTRUCTIONS
  async initCaster() {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const playerLadaTokenAccount = await this.getTokenAccount(
      game.ladaMintAccount,
    );
    const casterKeys = anchor.web3.Keypair.generate();

    return await this.client.program.rpc.initCaster({
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMint: game.ladaMintAccount,
        caster: casterKeys.publicKey,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: playerLadaTokenAccount,
      },
      signers: [this.client.wallet.payer, casterKeys],
    });
  }

  async casterCommitMove(lvl: number, col: number) {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);
    const [gameTurnData] = await this.getGameTurnData(game, gameAccount);

    return await this.client.program.rpc.casterCommitMove(lvl, col, {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ...mintAccounts,
        gameTurnData,
      },
      signers: [this.client.wallet.payer],
    });
  }

  async casterCommitLoot() {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const [gameTurnData] = await this.getGameTurnData(game, gameAccount);

    return await this.client.program.rpc.casterCommitLoot({
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        gameTurnData,
      },
    });
  }

  async casterCommitCraft(item1: Item, item2: Item, item3: Item) {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const [gameTurnData] = await this.getGameTurnData(game, gameAccount);
    const mintAccounts = await this.getMintAccounts(game);
    return await this.client.program.rpc.casterCommitCraft({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        item1: item1.publicKey,
        item2: item2.publicKey,
        item3: item3.publicKey,
        gameTurnData,
        ...mintAccounts,
      },
      signers: [this.client.wallet.payer],
    });
  }

  // Swap "action" to "turn"
  // Redeem is per caster
  async casterRedeemAction() {
    const [
      gameAccount,
      playerAccount,
      game,
      gameSigner,
    ] = await this.getAccounts();
    const item = Keypair.generate();
    const empty = Keypair.generate();
    const mintAccounts = await this.getMintAccounts(game);
    const playerLadaTokenAccount = await this.getTokenAccount(
      game.ladaMintAccount,
    );
    const [gameTurnData] = await this.getGameTurnData(
      game,
      gameAccount,
      this.caster?.turnCommit?.turn,
    );
    console.log('turn bish', this.caster.turnCommit.turn);
    console.log(
      'account turn data',
      await this.client.program.account.turnData.fetch(gameTurnData),
    );
    const remainingAccounts = this.caster?.turnCommit?.actions.spell
      ? {
          remainingAccounts: [
            {
              pubkey: this.caster?.modifiers?.spellBook,
              isSigner: false,
              isWritable: true,
            },
          ],
        }
      : {};

    return await this.client.program.rpc.casterRedeemAction({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        gameSigner: gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMintAccount: game.ladaMintAccount,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: playerLadaTokenAccount,
        gameTurnData,
        item: item.publicKey,
        staff: this.caster?.modifiers?.staff
          ? this.caster?.modifiers?.staff
          : empty.publicKey,
        head: this.caster?.modifiers?.head
          ? this.caster?.modifiers?.head
          : empty.publicKey,
        robe: this.caster?.modifiers?.robe
          ? this.caster?.modifiers?.robe
          : empty.publicKey,
        ...mintAccounts,
      },
      signers: [item, this.client.wallet.payer],
      ...remainingAccounts,
    });
  }

  async equipItem(equipmentItem: Item) {
    const [gameAccount, playerAccount] = await this.getAccounts();
    return await this.client.program.rpc.equipItem({
      accounts: {
        game: gameAccount,
        authority: this.playerPubKey,
        player: playerAccount,
        caster: this.caster?.publicKey,
        item: equipmentItem.publicKey,
      },
      signers: [this.client.wallet.payer],
    });
  }

  async unequipItem(itemPK: PublicKey) {
    const [gameAccount, playerAccount] = await this.getAccounts();
    return await this.client.program.rpc.unequipItem({
      accounts: {
        game: gameAccount,
        authority: this.playerPubKey,
        player: playerAccount,
        caster: this.caster?.publicKey,
        item: itemPK,
      },
      signers: [this.client.wallet.payer],
    });
  }

  async castSpell(equipmentItem: Item) {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);
    const [gameTurnData] = await this.getGameTurnData(game, gameAccount);

    if (
      this.caster?.modifiers?.spellBook &&
      equipmentItem.publicKey.toString() !==
        this.caster?.modifiers?.spellBook.toString()
    ) {
      await this.client.program.rpc.unequipItem({
        accounts: {
          game: gameAccount,
          authority: this.playerPubKey,
          player: playerAccount,
          caster: this.caster?.publicKey,
          item: this.caster?.modifiers?.spellBook,
        },
        signers: [this.client.wallet.payer],
      });

      await this.client.program.rpc.equipItem({
        accounts: {
          game: gameAccount,
          authority: this.playerPubKey,
          player: playerAccount,
          caster: this.caster?.publicKey,
          item: equipmentItem.publicKey,
        },
        signers: [this.client.wallet.payer],
      });
    } else {
      await this.client.program.rpc.equipItem({
        accounts: {
          game: gameAccount,
          authority: this.playerPubKey,
          player: playerAccount,
          caster: this.caster?.publicKey,
          item: equipmentItem.publicKey,
        },
        signers: [this.client.wallet.payer],
      });
    }

    const newCaster = await this.client.program.account.caster.fetch(
      this.caster?.publicKey,
    );

    return await this.client.program.rpc.casterCommitSpell({
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        game: gameAccount,
        player: playerAccount,
        caster: this.caster?.publicKey,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ...mintAccounts,
        spellbook: newCaster?.modifiers?.spellBook,
        gameTurnData,
      },
      signers: [this.client.wallet.payer],
    });
  }

  async manualResourceBurn(itemFeature: ItemFeature, amount: number) {
    const [gameAccount, playerAccount, game] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);
    const [gameTurnData] = await this.getGameTurnData(game, gameAccount);

    return await this.client.program.rpc.manualResourceBurn(
      itemFeature,
      new anchor.BN(amount),
      {
        accounts: {
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: this.playerPubKey,
          game: gameAccount,
          player: playerAccount,
          caster: this.caster?.publicKey,
          gameTurnData: gameTurnData,
          ...mintAccounts,
        },
        signers: [this.client.wallet.payer],
      },
    );
  }

  //DEBUG
  async giveLada() {
    const [gameAccount, , game, gameSigner] = await this.getAccounts();
    const playerLadaTokenAccount = await this.getTokenAccount(
      game.ladaMintAccount,
    );

    return await this.client.program.rpc.giveLada(new anchor.BN(1000 * 1e9), {
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        gameSigner: gameSigner,
        game: gameAccount,
        ladaMintAccount: game.ladaMintAccount,
        gameLadaTokenAccount: game.ladaTokenAccount,
        ladaTokenAccount: playerLadaTokenAccount,
      },
    });
  }

  async giveResources() {
    const [
      gameAccount,
      playerAccount,
      game,
      gameSigner,
    ] = await this.getAccounts();
    const mintAccounts = await this.getMintAccounts(game);

    return await this.client.program.rpc.giveResources(new anchor.BN(100), {
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: this.playerPubKey,
        gameSigner: gameSigner,
        game: gameAccount,
        player: playerAccount,
        ...mintAccounts,
      },
      signers: [this.client.wallet.payer],
    });
  }

  async giveItem(itemType: ItemType) {
    const [gameAccount, playerAccount] = await this.getAccounts();
    const item = Keypair.generate();

    return await this.client.program.rpc.giveItem(itemType, new anchor.BN(1), {
      accounts: {
        systemProgram: anchor.web3.SystemProgram.programId,
        game: gameAccount,
        authority: this.playerPubKey,
        player: playerAccount,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        item: item.publicKey,
      },
      signers: [this.client.wallet.payer, item],
    });
  }

  async changeTile() {
    const [gameAccount] = await this.getAccounts();

    return await this.client.program.rpc.changeTile(
      { crafting: {} },
      this.caster?.modifiers.tileLevel,
      this.caster?.modifiers.tileColumn,
      {
        accounts: {
          systemProgram: anchor.web3.SystemProgram.programId,
          game: gameAccount,
        },
      },
    );
  }

  //HELPERS
  private async getGameTurnData(game: Game, gameAccount: PublicKey, turn = -1) {
    const turnNumber = turn !== -1 ? turn : game?.turnInfo?.turn;

    return await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('turn_data'),
        gameAccount.toBuffer(),
        Buffer.from(anchor.utils.bytes.utf8.encode(String(turnNumber))),
      ],
      this.client.program.programId,
    );
  }

  private async getMintAccounts(game: Game) {
    const ata_resourcemint1 = await this.getTokenAccount(
      game.resource1MintAccount,
    );
    const ata_resourcemint2 = await this.getTokenAccount(
      game.resource2MintAccount,
    );
    const ata_resourcemint3 = await this.getTokenAccount(
      game.resource3MintAccount,
    );

    return {
      resource1MintAccount: game.resource1MintAccount,
      resource2MintAccount: game.resource2MintAccount,
      resource3MintAccount: game.resource3MintAccount,
      resource1TokenAccount: ata_resourcemint1,
      resource2TokenAccount: ata_resourcemint2,
      resource3TokenAccount: ata_resourcemint3,
    };
  }

  private async getTokenAccount(publicKey: anchor.web3.PublicKey) {
    return await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      publicKey,
      this.client.wallet.publicKey,
    );
  }

  private async getAccounts(): Promise<
    [PublicKey, PublicKey, Game, PublicKey]
  > {
    const gameAccount = new anchor.web3.PublicKey(this.gamePK);
    const [playerAccount] = findProgramAddressSync(
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

    return [gameAccount, playerAccount, game, gameSigner];
  }
}
