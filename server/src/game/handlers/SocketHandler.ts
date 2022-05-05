import { Server, Socket } from 'socket.io';
import { ExtendedError, Namespace } from 'socket.io/dist/namespace';

import { HttpError } from '../../errors/httpErrors/HttpError';
import { SocketBadConnectionError } from '../../errors/socketErrors/SocketBadConnectionError';
import { SocketGameAlreadyStartedError } from '../../errors/socketErrors/SocketGameAlreadyStartedError';
import { SocketGameNotExistError } from '../../errors/socketErrors/SocketGameNotExist';
import { SocketRoomFullError } from '../../errors/socketErrors/SocketRoomFullError';
import { SocketUnauthorizedError } from '../../errors/socketErrors/SocketUnauthorizedError';
import { SocketSessionExpiredError } from '../../errors/socketErrors/SocketUnauthorizedError copy';
import { SocketUserAlreadyConnectedError } from '../../errors/socketErrors/SocketUserAlreadyConnectedError';
import { SocketWrongRoomPasswordError } from '../../errors/socketErrors/SocketWrongRoomPasswordError';
import { UserModel } from '../../models/UserModel';
import { JwtValidationError, validateJWT } from '../../utils/authorization/Jwt';
import { elog, llog } from '../../utils/Logger';
import { Game, GAME_STATE } from '../gameStore/Game';
import { GamesStore } from '../gameStore/GamesStore';
import { Player, PlayerDTO } from '../gameStore/Player';
import { PlayerFactory } from '../gameStore/PlayerFactory';
import { GAME_TYPE } from '../GameTypes';
import {
	BUILD_IN_SOCKET_GAME_EVENTS,
	SOCKET_EVENT,
	SOCKET_GAME_EVENTS
} from './SocketEvents';

export abstract class SocketHandler {
	protected static connectedUsers = new Set<string>();
	protected static io: Server;
	private static isIoSet = false;

	protected namespace: Namespace;
	protected abstract onConnection(socket: Socket, game: Game, player: Player): void;

	constructor(io: Server, namespaceName: GAME_TYPE) {
		// TODO:forbid creating two same namespaces
		if (!SocketHandler.isIoSet) {
			SocketHandler.io = io;
			SocketHandler.isIoSet = true;
		}

		const namespace = '/' + namespaceName;
		SocketHandler.initializeIo(namespace);
		this.namespace = SocketHandler.io.of(namespace);
		this.registerListeners();
	}

	private registerListeners(): void {
		this.namespace.on(BUILD_IN_SOCKET_GAME_EVENTS.CONNECTION, (socket: Socket) => {
			const gameAndPlayer = this.registerBaseListeners(socket);
			if (!gameAndPlayer) return;
			this.onConnection(socket, gameAndPlayer.game, gameAndPlayer.player);
		});
	}

	private registerBaseListeners(socket: Socket): { game: Game; player: Player } | undefined {
		if (!socket.handshake.query.gameId || !socket?.middlewareData?.jwt?.sub) {
			const error = new SocketBadConnectionError();
			elog(error);
			socket.disconnect();
			return;
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
				PlayerDTO.fromPlayer(player)
			);
		});

		socket.on(BUILD_IN_SOCKET_GAME_EVENTS.DISCONNECT, (reason) => {
			SocketHandler.connectedUsers.delete(userId);
			game.disconnectPlayer(player);

			if (game.gameState === GAME_STATE.FINISHED)
				this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.GAME_FINISHED, gameId);
			else
				this.emitToRoomAndSender(
					socket,
					SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED,
					gameId,
					PlayerDTO.fromPlayer(player)
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
		SocketHandler.io
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

		const validationResult = validateJWT(socket.handshake.query.token as string);
		if (validationResult.success) {
			socket.middlewareData.jwt = validationResult.payload;
			return next();
		} else if (validationResult.error === JwtValidationError.EXPIRED) {
			elog(validationResult.error);
			return next(new SocketSessionExpiredError());
		} else {
			return next(new SocketUnauthorizedError());
		}
	};

	private static connectToGameRoom = async (socket: Socket, next: SocketNextFunction): Promise<void> => {
		if (!socket.handshake.query.gameId || !socket.middlewareData.jwt)
			return next(new SocketBadConnectionError());

		const gameId = socket.handshake.query.gameId as string;
		const userId = socket.middlewareData.jwt.sub as string;

		if (SocketHandler.connectedUsers.has(userId)) return next(new SocketUserAlreadyConnectedError());

		try {
			const user = await UserModel.findById(userId);
			if (!user) return next(new SocketBadConnectionError());

			const game = GamesStore.Instance.getGame(gameId);
			if (!game) return next(new SocketGameNotExistError());

			if (game.gameState !== GAME_STATE.NOT_STARTED) return next(new SocketGameAlreadyStartedError());

			if (game.isPasswordProtected) {
				const password = socket.handshake.query.password;
				if (!password) return next(new SocketWrongRoomPasswordError());
				if (game.password != password) return next(new SocketWrongRoomPasswordError());
			}

			if (game.isRoomFull()) return next(new SocketRoomFullError());

			SocketHandler.connectedUsers.add(userId);

			const newPlayer = PlayerFactory.createPlayerObject(
				game.gameType,
				user.id,
				user.username,
				socket.id,
				game.owner.id === user.id
			);
			game.addPlayer(newPlayer);
			socket.join(gameId);
			socket.to(gameId).emit(SOCKET_GAME_EVENTS.PLAYER_CONNECTED, PlayerDTO.fromPlayer(newPlayer));
			socket.emit(SOCKET_GAME_EVENTS.PLAYERS_IN_GAME, {
				players: game.getAllPlayersDTO(),
				thisPlayer: PlayerDTO.fromPlayer(newPlayer),
			});

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SocketNextFunction = (err?: ExtendedError | undefined) => void;
