export abstract class Player {
	isReady = false;
	constructor(
		public readonly id: string,
		public readonly username: string,
		public readonly socketId: string,
		public readonly isOwner: boolean
	) {}

	toggleIsReady(): void {
		this.isReady = !this.isReady;
	}
}

export class PlayerDTO {
	constructor(
		private id: string,
		private username: string,
		private isReady: boolean,
		private isOwner: boolean
	) {}

	static fromPlayer(player: Player): PlayerDTO {
		return new PlayerDTO(player.id, player.username, player.isReady, player.isOwner);
	}
}
