import { UserDTO } from './userDTO';

export type LoginDTO = {
	expiresIn: string;
	token: string;
	user: UserDTO;
};
