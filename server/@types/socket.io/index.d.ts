import { JwtPayload } from 'jsonwebtoken';

declare module 'socket.io' {
	interface Socket {
		//TODO: clean this up so no need to use sub as string in app
		middlewareData: {
			jwt?: string | JwtPayload;
		};
	}
}
