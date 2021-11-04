export class GameInstance {
	private usersInGame = new Set<string>();
	numberOfUsersInGame = 0;

	addUser(username: string): void {
		this.usersInGame.add(username);
		this.numberOfUsersInGame++;
	}

	deleteUser(username: string): void {
		this.usersInGame.delete(username);
		this.numberOfUsersInGame--;
	}

	get allUsersAsArray(): string[] {
		return Array.from(this.usersInGame);
	}
}
