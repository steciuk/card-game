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
		return new PlayerDTO(this.id, this.username, this.isReady);
	}
}

export class PlayerDTO {
	constructor(private id: string, private username: string, private isReady: boolean) {}
}
