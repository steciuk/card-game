import { Document, ObjectId } from 'mongoose';

import { UserDocument } from '../models/UserModel';

export class UserResponseDTO {
	constructor(private id: string, private username: string) {}

	static fromUserDocument(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		savedUser: Document<any, any, UserDocument> &
			UserDocument & {
				_id: ObjectId;
			} // TODO: temporary workaround - do nicer type
	): UserResponseDTO {
		return new UserResponseDTO(savedUser.id, savedUser.username);
	}
}
