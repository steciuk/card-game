export abstract class Player {
	isReady = false;
	constructor(
		public readonly id: string,
		public readonly username: string,
		public readonly socketId: string
	) {}

	toggleIsReady(): void {
		this.isReady = !this.isReady;
	}

	toPlayerDTO(): PlayerDTO {
		return { id: this.id, username: this.username, isReady: this.isReady };
	}
}

export type PlayerDTO = { id: string; username: string; isReady: boolean };
