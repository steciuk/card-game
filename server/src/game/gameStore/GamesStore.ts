import { Game } from './Game';

export class GamesStore {
	private static instance: GamesStore;

	private activeGames = new Map<string, Game>();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	static get Instance(): GamesStore {
		return this.instance || (this.instance = new this());
	}

	addGame(game: Game): void {
		this.activeGames.set(game.id, game);
	}

	deleteGame(id: string): void {
		this.activeGames.delete(id);
	}

	getGame(gameId: string): Game | undefined {
		return this.activeGames.get(gameId);
	}

	get allGamesAsArray(): Game[] {
		return Array.from(this.activeGames.values());
	}
}
