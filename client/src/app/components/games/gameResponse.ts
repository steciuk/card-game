export enum GameTypes {
	'MAKAO',
}

export type Game = {
	ownerName: string;
	gameType: GameTypes;
	maxPlayers: number;
	name: string;
	id: string;
	isPasswordProtected: boolean;
};
