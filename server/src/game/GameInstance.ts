export class GameInstance {
	usersInGame = new Set<string>();

	addUser(username: string): void {
		this.usersInGame.add(username);
	}

	deleteUser(username: string): void {
		this.usersInGame.delete(username);
	}

	get allUsersAsArray(): string[] {
		return Array.from(this.usersInGame);
	}
}
