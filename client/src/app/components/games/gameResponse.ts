export enum GameType {
	'MAKAO',
}

export type Game = {
	ownerName: string;
	gameType: GameType;
	maxPlayers: number;
	name: string;
	id: string;
};
