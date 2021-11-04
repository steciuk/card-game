import { readFileSync } from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { ExtendedError, Namespace } from 'socket.io/dist/namespace';

import { PUBLIC_KEY_PATH } from '../Const';
import { HttpError } from '../errors/httpErrors/HttpError';
import {
	DB_RESOURCES,
	ResourceNotFoundError
} from '../errors/httpErrors/ResourceNotFoundError';
import { SocketBadConnectionError } from '../errors/socketErrors/SocketBadConnectionError';
import { SocketPropertyNotSetError } from '../errors/socketErrors/SocketPropertyNotSetError';
import { SocketUnauthorizedError } from '../errors/socketErrors/SocketUnauthorizedError';
import { SocketUserAlreadyConnectedError } from '../errors/socketErrors/SocketUserAlreadyConnectedError';
import { GameModel, GameType } from '../models/GameModel';
import { UserModel } from '../models/UserModel';
import { elog, llog } from '../utils/Logger';
import { GameInstance } from './GameInstance';

export abstract class GameHandler {
	protected static PUBLIC_KEY = ((): string => {
		try {
			return readFileSync(PUBLIC_KEY_PATH, 'utf8');
		} catch (error) {
			elog(error);
			process.exit(1);
		}
	})();
	protected static connectedUsers = new Set<string>();
	protected static io: Server;
	private static isIoSet = false;

	protected activeGames = new Map<string, GameInstance>();
	protected namespace: Namespace;
	protected abstract onConnection(socket: Socket, gameId: string, username: string, userId: string): void;

	constructor(io: Server, namespaceName: GameType) {
		if (!GameHandler.isIoSet) {
			GameHandler.io = io;
			GameHandler.isIoSet = true;
		}

		const namespace = '/' + namespaceName;
		GameHandler.initializeIo(namespace);
		this.namespace = GameHandler.io.of(namespace);
	}

	protected registerListeners(): void {
		this.namespace.on('connection', (socket: Socket) => {
			const { gameId, username, userId } = this.registerBaseListeners(socket);
			this.onConnection(socket, gameId, username, userId);
		});
	}

	private registerBaseListeners(socket: Socket): { gameId: string; username: string; userId: string } {
		if (
			!socket?.middlewareData?.gameId ||
			!socket?.middlewareData?.username ||
			!socket?.middlewareData?.jwt?.sub
		) {
			const error = new SocketPropertyNotSetError();
			elog(error);
			socket.disconnect();
			throw error; //TODO: return
		}
		llog(`User ${socket.id} connected`);
		const gameId = socket.middlewareData.gameId;
		const username = socket.middlewareData.username;
		const userId = socket.middlewareData.jwt.sub as string;
		this.addUserToGameAndEmitUpdate(socket, userId, gameId, username);

		socket.on('disconnect', (reason) => {
			this.removeUserFromGameAndEmitUpdate(socket, userId, gameId, username);
			llog(`User ${socket.id} disconnected - ${reason}`);
		});

		socket.on('error', (error) => {
			elog(error);
			socket.disconnect();
		});

		return { gameId, username, userId };
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
		if (!socket.handshake.query.token) {
			const error = new SocketUnauthorizedError();
			elog(error);
			return next(error);
		}

		try {
			const token = (socket.handshake.query.token as string).split(' ')[1];
			const jwt = jsonwebtoken.verify(token, GameHandler.PUBLIC_KEY, { algorithms: ['RS256'] });
			socket.middlewareData.jwt = jwt;
			next();
		} catch (error) {
			elog(error);
			return next(new SocketUnauthorizedError());
		}
	};

	private static connectToGameRoom = async (socket: Socket, next: SocketNextFunction): Promise<void> => {
		if (!socket.handshake.query.gameId || !socket.middlewareData.jwt) {
			const error = new SocketBadConnectionError();
			elog(error);
			return next(error);
		}

		const gameId = socket.handshake.query.gameId as string;
		const userId = socket.middlewareData.jwt.sub as string;

		if (GameHandler.connectedUsers.has(userId)) {
			const error = new SocketUserAlreadyConnectedError(userId);
			elog(error);
			return next(error);
		}

		try {
			const user = await UserModel.findById(userId);
			if (!user) return next(new ResourceNotFoundError(DB_RESOURCES.USER, userId));
			socket.middlewareData.username = user.username;

			const game = await GameModel.findById(gameId);
			if (!game) return next(new ResourceNotFoundError(DB_RESOURCES.GAME, userId));

			socket.middlewareData.gameId = gameId;
			socket.join(gameId);

			next();
		} catch (error: unknown) {
			elog(error);
			next(new HttpError());
		}
	};

	private addPlayerToTheGameAndGetOthers(gameId: string, username: string): string[] {
		let game = this.activeGames.get(gameId);
		if (!game) {
			game = new GameInstance();
			this.activeGames.set(gameId, game);
		}

		game.addUser(username);
		return game.allUsersAsArray;
	}

	private removePlayerFromGameAndGetOthers(gameId: string, username: string): string[] {
		const game = this.activeGames.get(gameId);
		if (!game) {
			throw new Error('Game should exist'); //TODO: custom error?
		}

		game.deleteUser(username);

		const users = game.allUsersAsArray;
		if (users.length === 0) this.activeGames.delete(gameId);

		return game.allUsersAsArray;
	}

	private removeUserFromGameAndEmitUpdate(
		socket: Socket,
		userId: string,
		gameId: string,
		username: string
	): void {
		GameHandler.connectedUsers.delete(userId);
		const usersInGame = this.removePlayerFromGameAndGetOthers(gameId, username);
		socket.to(gameId).emit('playerConnected', usersInGame);
	}

	private addUserToGameAndEmitUpdate(
		socket: Socket,
		userId: string,
		gameId: string,
		username: string
	): void {
		GameHandler.connectedUsers.add(userId);
		const usersInGame = this.addPlayerToTheGameAndGetOthers(gameId, username);
		socket.to(gameId).emit('playerConnected', usersInGame);
		socket.emit('playerConnected', usersInGame);
	}
}

export type SocketNextFunction = (err?: ExtendedError | undefined) => void;
