export enum GameTypes {
	MAKAO = 'MAKAO',
}

export type Game = {
	ownerName: string;
	gameType: GameTypes;
	maxPlayers: number;
	name: string;
	id: string;
	isPasswordProtected: boolean;
};
