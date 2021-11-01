import { readFileSync } from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

import { PUBLIC_KEY_PATH } from '../Const';
import { UnauthorizedError } from '../errors/httpErrors/user/UnauthorizedError';
import { elog } from '../utils/Logger';

let PUBLIC_KEY: string;
try {
	PUBLIC_KEY = readFileSync(PUBLIC_KEY_PATH, 'utf8');
} catch (error) {
	elog(error);
	process.exit(1);
}

export function socketHandler(io: Server): void {
	io.use((socket, next) => {
		if (!socket.handshake.query.token) return next(new UnauthorizedError());
		const token = (socket.handshake.query.token as string).split(' ')[1];

		try {
			const jwt = jsonwebtoken.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
			socket.jwt = jwt;
			next();
		} catch (error) {
			return next(new UnauthorizedError());
		}
	}).on('connection', (socket: Socket) => {
		console.log(`User ${socket.id} connected`);

		socket.on('disconnect', (reason) => {
			console.log(`User ${socket.id} disconnected - ${reason}`);
		});
	});
}
