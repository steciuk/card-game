export class GamesStore {
	private static instance: GamesStore;

	// private activeGames = new S

	private constructor() {
		//...
	}

	public static get Instance() {
		return this.instance || (this.instance = new this());
	}
}

// export class Game {
// 	gameType: string; // Mongoose does not support typescript enums
// 	ownerId: ObjectId;
// 	ownerName: string;
// 	maxPlayers: number;
// 	name: string;
// 	password?: string;
// 	created: number;
// 	id: string;
// }
