import { readFileSync } from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import { PUBLIC_KEY_PATH } from '../Const';
import { BadRequestError } from '../errors/httpErrors/BadRequestError';
import { HttpError } from '../errors/httpErrors/HttpError';
import { UnauthorizedError } from '../errors/httpErrors/user/UnauthorizedError';
import { UserNotFoundError } from '../errors/httpErrors/user/UserNotFoundError';
import { GameModel } from '../models/GameModel';
import { UserModel } from '../models/UserModel';
import { elog } from '../utils/Logger';

let PUBLIC_KEY: string;
try {
	PUBLIC_KEY = readFileSync(PUBLIC_KEY_PATH, 'utf8');
} catch (error) {
	elog(error);
	process.exit(1);
}

export function socketHandler(io: Server): void {
	io.use(addMiddlewareDataProperty)
		.use(verifyJwt)
		.use(connectToGameRoom)
		.on('connection', (socket: Socket) => {
			console.log(`User ${socket.id} connected`);

			socket.on('disconnect', (reason) => {
				console.log(`User ${socket.id} disconnected - ${reason}`);
			});
		});
}

type NextFunction = (err?: ExtendedError | undefined) => void;

function addMiddlewareDataProperty(socket: Socket, next: NextFunction): void {
	socket.middlewareData = {};
	next();
}

function verifyJwt(socket: Socket, next: NextFunction): void {
	if (!socket.handshake.query.token) {
		const error = new UnauthorizedError();
		elog(error);
		return next(error);
	}

	try {
		const token = (socket.handshake.query.token as string).split(' ')[1];
		const jwt = jsonwebtoken.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
		socket.middlewareData.jwt = jwt;
		next();
	} catch (error) {
		elog(error);
		return next(new UnauthorizedError());
	}
}

async function connectToGameRoom(socket: Socket, next: NextFunction): Promise<void> {
	if (!socket.handshake.query.gameId || !socket.middlewareData.jwt) {
		const error = new BadRequestError();
		elog(error);
		return next(error);
	}

	const gameId = socket.handshake.query.gameId as string;
	const userId = socket.middlewareData.jwt.sub as string;

	try {
		const user = await UserModel.findById(userId);
		if (!user) return next(new UserNotFoundError(userId));
		socket.middlewareData.username = user.username;

		const game = await GameModel.findById(gameId);
		if (!game) return next(new BadRequestError());

		socket.middlewareData.roomName = gameId;
		socket.join(gameId);
		socket.to(gameId).emit('playerConnected', user.username);

		next();
	} catch (error: unknown) {
		elog(error);
		next(new HttpError());
	}
}
