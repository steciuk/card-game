import { UserDTO } from './userDTO';

export type LoginDTO = {
	token: string;
	user: UserDTO;
};

export type ParsedJwtPayload = {
	sub: string;
	exp: number;
	iat: number;
};
