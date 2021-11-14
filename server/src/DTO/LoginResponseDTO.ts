import { UserResponseDTO } from './UserResponseDTO';

export class LoginResponseDTO {
	constructor(private user: UserResponseDTO, private token: string) {}
}
