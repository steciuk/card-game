import { SocketService } from 'src/app/services/socket.service';

import { PhaserDeck } from '../../phaserComponents/phaserDeck';
import { PHASER_CONFIG } from '../../phaserConfig';
import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

const SCENE_CONFIG = {
	N_GON_RADIUS_PART_OF_GAME_SCREEN: 0.8,
	DECK_PART_OF_N_GON_SIDE: 0.8,
	BASE_CARD_SCALE: 0.2,
	MIN_CARD_SCALE: 0.1,
	THIS_PLAYER_DECK_PART_OF_SCREEN_WIDTH: 0.8,
};

export class MakaoScene extends BaseScene {
	thisPlayer!: ThisMakaoPlayerDTO;
	playersIdsInOrder: string[] = [];
	shiftedPlayersIdsInOrder: string[] = [];
	players = new Map<string, MakaoPlayer>();
	currentPlayerNumber = 0;
	numberOfPlayers = 0;

	deckWidth = 0;
	otherPlayersCardsScale = 0;

	constructor(socketService: SocketService) {
		super(socketService, { key: SCENE_KEYS.MAKAO });
	}

	init(): void {}

	preload(): void {
		this.loadAllPlayingCards();
		this.loadBacks();
	}

	create(): void {
		this.add.text(0, 0, 'Makao');
		this.socketService.emitSocketEvent(
			SOCKET_GAME_EVENTS.GET_GAME_STATE,
			(makaoGameStateForPlayer: MakaoGameStateForPlayerDTO) => {
				this.updateGameState(makaoGameStateForPlayer);
				this.afterCreate();
			}
		);
	}

	private afterCreate(): void {
		this.drawOtherPlayersCards();
		this.drawThisPlayersCards();
	}

	update(): void {}

	private updateGameState(makaoGameStateForPlayer: MakaoGameStateForPlayerDTO): void {
		const midPoint = { x: this.xRelative(0.5), y: this.yRelative(0.5) };

		this.thisPlayer = makaoGameStateForPlayer.thisMakaoPlayer;
		this.currentPlayerNumber = makaoGameStateForPlayer.currentPlayerNumber;

		makaoGameStateForPlayer.makaoPlayersInOrder.forEach((makaoPlayer) => {
			this.playersIdsInOrder.push(makaoPlayer.id);
			this.players.set(makaoPlayer.id, MakaoPlayer.fromOtherMakaoPlayerDTO(makaoPlayer));
		});

		this.numberOfPlayers = this.playersIdsInOrder.length;

		const thisPlayerIndex = this.playersIdsInOrder.indexOf(this.thisPlayer.id);
		this.shiftedPlayersIdsInOrder = [...this.playersIdsInOrder];
		this.shiftedPlayersIdsInOrder = this.shiftedPlayersIdsInOrder.concat(
			this.shiftedPlayersIdsInOrder.splice(0, thisPlayerIndex)
		);

		const radius =
			(Math.min(PHASER_CONFIG.height, PHASER_CONFIG.width) / 2) *
			SCENE_CONFIG.N_GON_RADIUS_PART_OF_GAME_SCREEN;

		this.deckWidth =
			2 * radius * Math.sin(Math.PI / this.numberOfPlayers) * SCENE_CONFIG.DECK_PART_OF_N_GON_SIDE;

		this.otherPlayersCardsScale = Math.max(
			SCENE_CONFIG.BASE_CARD_SCALE - (this.numberOfPlayers - 2) * 0.02,
			SCENE_CONFIG.MIN_CARD_SCALE
		);

		this.shiftedPlayersIdsInOrder.slice(1).forEach((playerId, i) => {
			const player = this.players.get(playerId) as MakaoPlayer;
			i += 1;
			player.x = Math.round(
				midPoint.x + radius * Math.cos(Math.PI * ((2 * i) / this.numberOfPlayers + 0.5))
			);
			player.y = Math.round(
				midPoint.y + radius * Math.sin(Math.PI * ((2 * i) / this.numberOfPlayers + 0.5))
			);
			player.rotation = Math.PI * ((2 * i) / this.numberOfPlayers);
		});
	}

	private drawThisPlayersCards(): void {
		new PhaserDeck(
			this,
			this.xRelative(0.5),
			this.yRelative(0.9),
			0,
			SCENE_CONFIG.BASE_CARD_SCALE,
			PHASER_CONFIG.width * SCENE_CONFIG.THIS_PLAYER_DECK_PART_OF_SCREEN_WIDTH,
			this.thisPlayer.cards
		);
	}

	private drawOtherPlayersCards(): void {
		this.shiftedPlayersIdsInOrder.slice(1).forEach((playerId) => {
			const player = this.players.get(playerId) as MakaoPlayer;
			new PhaserDeck(
				this,
				player.x,
				player.y,
				player.rotation,
				this.otherPlayersCardsScale,
				this.deckWidth,
				'RB',
				player.numCards
			);
		});
	}
}

type OtherMakaoPlayerDTO = {
	id: string;
	username: string;
	numCards: number;
};

type ThisMakaoPlayerDTO = {
	id: string;
	username: string;
	cards: string[];
};

type MakaoGameStateForPlayerDTO = {
	thisMakaoPlayer: ThisMakaoPlayerDTO;
	currentPlayerNumber: number;
	makaoPlayersInOrder: OtherMakaoPlayerDTO[];
};

// class MakaoPlayer {
// 	x = 0;
// 	y = 0;
// 	rotation = 0;

// 	constructor(public id: string, public username: string) {}
// }

// class ThisMakaoPlayer extends MakaoPlayer {
// 	constructor(id: string, username: string, public cards: string[]) {
// 		super(id, username);
// 	}

// 	static fromThisMakaoPlayerDTO(thisMakaoPlayerDto: ThisMakaoPlayerDTO): ThisMakaoPlayer {
// 		return new ThisMakaoPlayer(
// 			thisMakaoPlayerDto.id,
// 			thisMakaoPlayerDto.username,
// 			thisMakaoPlayerDto.cards
// 		);
// 	}
// }

class MakaoPlayer {
	x = 0;
	y = 0;
	rotation = 0;

	constructor(public id: string, public username: string, public numCards: number) {}

	static fromOtherMakaoPlayerDTO(otherMakaoPlayerDTO: OtherMakaoPlayerDTO): MakaoPlayer {
		return new MakaoPlayer(
			otherMakaoPlayerDTO.id,
			otherMakaoPlayerDTO.username,
			otherMakaoPlayerDTO.numCards
		);
	}
}
