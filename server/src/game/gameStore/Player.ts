export abstract class Player {
	isReady = false;
	constructor(public id: string, public username: string) {}

	toggleIsReady(): void {
		this.isReady = !this.isReady;
	}

	toPlayerDTO(): PlayerDTO {
		return { id: this.id, username: this.username };
	}
}

export type PlayerDTO = { id: string; username: string };
