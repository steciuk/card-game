import { readFileSync } from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import { PUBLIC_KEY_PATH } from '../Const';
import { BadRequestError } from '../errors/httpErrors/BadRequestError';
import { HttpError } from '../errors/httpErrors/HttpError';
import { UnauthorizedError } from '../errors/httpErrors/user/UnauthorizedError';
import { UserAlreadyConnected } from '../errors/httpErrors/user/UserAlreadyConnected';
import { UserNotFoundError } from '../errors/httpErrors/user/UserNotFoundError';
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
				console.log(socket.middlewareData.jwt);
				// TODO: cleanup custom Socket types
				this.connectedUsers.add(socket?.middlewareData?.jwt?.sub as string);
				llog(`User ${socket.id} connected`);

				const gameId = socket?.middlewareData?.gameId as string;
				const username = socket?.middlewareData?.username as string;
				const usersInGame = this.addPlayerToTheGameAndGetOthers(gameId, username);
				socket.to(gameId).emit('playerConnected', usersInGame);
				socket.emit('playerConnected', usersInGame);

				socket.on('disconnect', (reason) => {
					// TODO: cleanup custom Socket types
					this.connectedUsers.delete(socket?.middlewareData?.jwt?.sub as string);
					llog(`User ${socket.id} disconnected - ${reason}`);
				});
			});
	}

	private addMiddlewareDataProperty(socket: Socket, next: NextFunction): void {
		socket.middlewareData = {};
		next();
	}

	private verifyJwt = (socket: Socket, next: NextFunction): void => {
		if (!socket.handshake.query.token) {
			const error = new UnauthorizedError();
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
			return next(new UnauthorizedError());
		}
	};

	private connectToGameRoom = async (socket: Socket, next: NextFunction): Promise<void> => {
		if (!socket.handshake.query.gameId || !socket.middlewareData.jwt) {
			const error = new BadRequestError();
			elog(error);
			return next(error);
		}

		const gameId = socket.handshake.query.gameId as string;
		const userId = socket.middlewareData.jwt.sub as string;

		if (this.connectedUsers.has(userId)) {
			const error = new UserAlreadyConnected(userId);
			elog(error);
			return next(error);
		}

		try {
			const user = await UserModel.findById(userId);
			if (!user) return next(new UserNotFoundError(userId));
			socket.middlewareData.username = user.username;

			const game = await GameModel.findById(gameId);
			if (!game) return next(new BadRequestError());

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
}

type NextFunction = (err?: ExtendedError | undefined) => void;
