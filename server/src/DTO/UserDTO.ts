import { IsString } from 'class-validator';

//TODO: restrict length of inputs on backend
export class UserDTO {
	@IsString()
	username: string;
	@IsString()
	password: string;
}
