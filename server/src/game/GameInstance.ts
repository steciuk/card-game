export class GameInstance {
	usersInGame = new Set<string>();

	addUser(username: string): void {
		this.usersInGame.add(username);
	}

	get allUsersAsArray(): string[] {
		return Array.from(this.usersInGame);
	}
}
