import { SocketService } from 'src/app/services/socket.service';

import { PhaserDeck } from '../../phaserComponents/phaserDeck';
import { PHASER_CONFIG } from '../../phaserConfig';
import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

const SCENE_CONFIG = {
	N_GON_RADIUS_PART_OF_GAME_SCREEN: 0.8,
	DECK_PART_OF_N_GON_SIDE: 0.8,
	CARDS_SCALE: 0.2,
};

export class MakaoScene extends BaseScene {
	thisPlayer!: ThisMakaoPlayerDTO;
	playersIdsInOrder: string[] = [];
	shiftedPlayersIdsInOrder: string[] = [];
	players = new Map<string, MakaoPlayer>();
	currentPlayerNumber = 0;
	numberOfPlayers = 0;
	deckWidth = 0;

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
		const midPoint = { x: PHASER_CONFIG.width / 2, y: PHASER_CONFIG.height / 2 };

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

		this.calculateAndSetDeckWidth();

		const radius =
			(Math.min(PHASER_CONFIG.height, PHASER_CONFIG.width) / 2) *
			SCENE_CONFIG.N_GON_RADIUS_PART_OF_GAME_SCREEN;

		this.shiftedPlayersIdsInOrder.forEach((playerId, i) => {
			const player = this.players.get(playerId) as MakaoPlayer;
			player.x = Math.round(
				midPoint.x + radius * Math.cos(Math.PI * ((2 * i) / this.numberOfPlayers + 0.5))
			);
			player.y = Math.round(
				midPoint.y + radius * Math.sin(Math.PI * ((2 * i) / this.numberOfPlayers + 0.5))
			);
			player.rotation = (Math.PI * 2 * i) / this.numberOfPlayers;
		});
	}

	private drawThisPlayersCards(): void {
		const player = this.players.get(this.thisPlayer.id) as MakaoPlayer;
		this.deckFactory(player.x, player.y, player.rotation, this.thisPlayer.cards);
	}

	private drawOtherPlayersCards(): void {
		this.shiftedPlayersIdsInOrder.slice(1).forEach((playerId) => {
			const player = this.players.get(playerId) as MakaoPlayer;
			this.deckFactory(player.x, player.y, player.rotation, 'RB', player.numCards);
		});
	}

	private calculateAndSetDeckWidth(): void {
		this.deckWidth = 100 * SCENE_CONFIG.DECK_PART_OF_N_GON_SIDE;
	}

	private deckFactory(
		x: number,
		y: number,
		rotation: number,
		cards: string | string[],
		numberOfCards = 1
	): PhaserDeck {
		return new PhaserDeck(
			this,
			x,
			y,
			rotation,
			SCENE_CONFIG.CARDS_SCALE,
			this.deckWidth,
			cards,
			numberOfCards
		);
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
