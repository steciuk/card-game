import { Server, Socket } from 'socket.io';
import { ExtendedError, Namespace } from 'socket.io/dist/namespace';

import { HttpError } from '../../errors/httpErrors/HttpError';
import {
	DB_RESOURCES,
	ResourceNotFoundError
} from '../../errors/httpErrors/ResourceNotFoundError';
import { SocketBadConnectionError } from '../../errors/socketErrors/SocketBadConnectionError';
import { SocketGameAlreadyStartedError } from '../../errors/socketErrors/SocketGameAlreadyStartedError';
import { SocketRoomFullError } from '../../errors/socketErrors/SocketRoomFullError';
import { SocketUnauthorizedError } from '../../errors/socketErrors/SocketUnauthorizedError';
import { SocketUserAlreadyConnectedError } from '../../errors/socketErrors/SocketUserAlreadyConnectedError';
import { SocketWrongRoomPasswordError } from '../../errors/socketErrors/SocketWrongRoomPasswordError';
import { UserModel } from '../../models/UserModel';
import { validateJWT } from '../../utils/authorization/Jwt';
import { elog, llog } from '../../utils/Logger';
import { Game } from '../gameStore/Game';
import { GamesStore } from '../gameStore/GamesStore';
import { Player } from '../gameStore/Player';
import { PlayerFactory } from '../gameStore/PlayerFactory';
import { GameTypes } from '../GameTypes';
import {
	BUILD_IN_SOCKET_GAME_EVENTS,
	SOCKET_EVENT,
	SOCKET_GAME_EVENTS
} from './SocketEvents';

export abstract class GameHandler {
	protected static connectedUsers = new Set<string>();
	protected static io: Server;
	private static isIoSet = false;

	protected namespace: Namespace;
	protected abstract onConnection(socket: Socket, game: Game, player: Player): void;

	constructor(io: Server, namespaceName: GameTypes) {
		// TODO:forbid creating two same namespaces
		if (!GameHandler.isIoSet) {
			GameHandler.io = io;
			GameHandler.isIoSet = true;
		}

		const namespace = '/' + namespaceName;
		GameHandler.initializeIo(namespace);
		this.namespace = GameHandler.io.of(namespace);
	}

	protected registerListeners(): void {
		this.namespace.on(BUILD_IN_SOCKET_GAME_EVENTS.CONNECTION, (socket: Socket) => {
			const { game, player } = this.registerBaseListeners(socket);
			this.onConnection(socket, game, player);
		});
	}

	private registerBaseListeners(socket: Socket): { game: Game; player: Player } {
		if (!socket.handshake.query.gameId || !socket?.middlewareData?.jwt?.sub) {
			const error = new SocketBadConnectionError();
			socket.disconnect();
			throw error; //TODO: return
		}
		llog(`Socket ${socket.id} connected`);
		const gameId = socket.handshake.query.gameId as string;
		const userId = socket.middlewareData.jwt.sub as string;

		const game = GamesStore.Instance.getGame(gameId) as Game;
		const player = game.getPlayer(userId) as Player;

		socket.on(SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY, () => {
			player.toggleIsReady();
			this.emitToRoomAndSender(
				socket,
				SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY,
				gameId,
				player.toPlayerDTO()
			);
		});

		socket.on(BUILD_IN_SOCKET_GAME_EVENTS.DISCONNECT, (reason) => {
			GameHandler.connectedUsers.delete(userId);
			game.removePlayer(userId);
			this.emitToRoomAndSender(
				socket,
				SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED,
				gameId,
				player.toPlayerDTO()
			);

			llog(`Socket ${socket.id} disconnected - ${reason}`);
		});

		socket.on(BUILD_IN_SOCKET_GAME_EVENTS.ERROR, (error) => {
			elog('ONERROR', error);
			socket.disconnect();
		});

		return { game, player };
	}

	private static initializeIo(namespace: string): void {
		GameHandler.io
			.of(namespace)
			.use(this.addMiddlewareDataProperty)
			.use(this.verifyJwt)
			.use(this.connectToGameRoom);
	}

	private static addMiddlewareDataProperty(socket: Socket, next: SocketNextFunction): void {
		socket.middlewareData = {};
		next();
	}

	private static verifyJwt = (socket: Socket, next: SocketNextFunction): void => {
		if (!socket.handshake.query.token) return next(new SocketUnauthorizedError());

		try {
			const jwt = validateJWT(socket.handshake.query.token as string);
			socket.middlewareData.jwt = jwt;
			next();
		} catch (error) {
			elog(error);
			return next(new SocketUnauthorizedError());
		}
	};

	private static connectToGameRoom = async (socket: Socket, next: SocketNextFunction): Promise<void> => {
		if (!socket.handshake.query.gameId || !socket.middlewareData.jwt)
			return next(new SocketBadConnectionError());

		const gameId = socket.handshake.query.gameId as string;
		const userId = socket.middlewareData.jwt.sub as string;

		if (GameHandler.connectedUsers.has(userId)) return next(new SocketUserAlreadyConnectedError(userId));

		try {
			const user = await UserModel.findById(userId);
			if (!user) return next(new ResourceNotFoundError(DB_RESOURCES.USER, userId));

			const game = GamesStore.Instance.getGame(gameId);
			if (!game) return next(new ResourceNotFoundError(DB_RESOURCES.GAME, gameId)); // TODO: change since not using db anymore

			if (game.isStarted) next(new SocketGameAlreadyStartedError());

			if (game.isPasswordProtected) {
				const password = socket.handshake.query.password;
				if (!password) return next(new SocketWrongRoomPasswordError());
				if (game.password != password) return next(new SocketWrongRoomPasswordError());
			}

			if (game.isRoomFull()) return next(new SocketRoomFullError());

			GameHandler.connectedUsers.add(userId);

			const newPlayer = PlayerFactory.createPlayerObject(
				game.gameType,
				user.id,
				user.username,
				socket.id
			);
			game.addPlayer(newPlayer);
			socket.join(gameId);
			socket.to(gameId).emit(SOCKET_GAME_EVENTS.PLAYER_CONNECTED, newPlayer.toPlayerDTO());
			socket.emit(SOCKET_GAME_EVENTS.PLAYERS_IN_GAME, game.getAllPlayersDTO());

			next();
		} catch (error: unknown) {
			elog(error);
			next(new HttpError());
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected emitToRoomAndSender(socket: Socket, event: SOCKET_EVENT, gameId: string, ...args: any[]): void {
		socket.to(gameId).emit(event, ...args);
		socket.emit(event, ...args);
	}
}

export type SocketNextFunction = (err?: ExtendedError | undefined) => void;
