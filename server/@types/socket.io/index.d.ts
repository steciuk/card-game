import { JwtPayload } from 'jsonwebtoken';

declare module 'socket.io' {
	interface Socket {
		jwt?: string | JwtPayload;
	}
}
