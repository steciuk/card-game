import { readFileSync } from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import { PUBLIC_KEY_PATH } from '../Const';
import { HttpError } from '../errors/httpErrors/HttpError';
import { DB_RESOURCES, ResourceNotFoundError } from '../errors/httpErrors/ResourceNotFoundError';
import { SocketBadConnectionError } from '../errors/socketErrors/SocketBadConnectionError';
import { SocketPropertyNotSetError } from '../errors/socketErrors/SocketPropertyNotSetError';
import { SocketUnauthorizedError } from '../errors/socketErrors/SocketUnauthorizedError';
import { SocketUserAlreadyConnectedError } from '../errors/socketErrors/SocketUserAlreadyConnectedError';
import { GameModel } from '../models/GameModel';
import { UserModel } from '../models/UserModel';
import { elog, llog } from '../utils/Logger';
import { GameInstance } from './GameInstance';

export class GameHandler {
	private PUBLIC_KEY!: string;
	private activeGames = new Map<string, GameInstance>();
	private connectedSockets = new Set<string>();
	private connectedUsers = new Set<string>();

	constructor(private io: Server) {
		try {
			this.PUBLIC_KEY = readFileSync(PUBLIC_KEY_PATH, 'utf8');
		} catch (error) {
			elog(error);
			process.exit(1);
		}
	}

	startSocketListener(): void {
		this.io
			.use(this.addMiddlewareDataProperty)
			.use(this.verifyJwt)
			.use(this.connectToGameRoom)
			.on('connection', (socket: Socket) => {
				if (
					!socket?.middlewareData.gameId ||
					!socket?.middlewareData.username ||
					!socket?.middlewareData?.jwt?.sub
				) {
					const error = new SocketPropertyNotSetError();
					elog(error);
					socket.disconnect();
					return;
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
			});
	}

	private addMiddlewareDataProperty(socket: Socket, next: NextFunction): void {
		socket.middlewareData = {};
		next();
	}

	private verifyJwt = (socket: Socket, next: NextFunction): void => {
		if (!socket.handshake.query.token) {
			const error = new SocketUnauthorizedError();
			elog(error);
			return next(error);
		}

		try {
			const token = (socket.handshake.query.token as string).split(' ')[1];
			const jwt = jsonwebtoken.verify(token, this.PUBLIC_KEY, { algorithms: ['RS256'] });
			socket.middlewareData.jwt = jwt;
			next();
		} catch (error) {
			elog(error);
			return next(new SocketUnauthorizedError());
		}
	};

	private connectToGameRoom = async (socket: Socket, next: NextFunction): Promise<void> => {
		if (!socket.handshake.query.gameId || !socket.middlewareData.jwt) {
			const error = new SocketBadConnectionError();
			elog(error);
			return next(error);
		}

		const gameId = socket.handshake.query.gameId as string;
		const userId = socket.middlewareData.jwt.sub as string;

		if (this.connectedUsers.has(userId)) {
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
		this.connectedUsers.delete(userId);
		const usersInGame = this.removePlayerFromGameAndGetOthers(gameId, username);
		socket.to(gameId).emit('playerConnected', usersInGame);
	}

	private addUserToGameAndEmitUpdate(
		socket: Socket,
		userId: string,
		gameId: string,
		username: string
	): void {
		this.connectedUsers.add(userId);
		const usersInGame = this.addPlayerToTheGameAndGetOthers(gameId, username);
		socket.to(gameId).emit('playerConnected', usersInGame);
		socket.emit('playerConnected', usersInGame);
	}
}

type NextFunction = (err?: ExtendedError | undefined) => void;
