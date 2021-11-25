export type SOCKET_EVENT = SOCKET_GAME_EVENTS | BUILD_IN_SOCKET_GAME_EVENTS;

export enum SOCKET_GAME_EVENTS {
	PLAYER_CONNECTED = 'player_connected',
	PLAYER_DISCONNECTED = 'player_disconnected',
	PLAYERS_IN_GAME = 'players_in_game',
	PLAYER_TOGGLE_READY = 'player_toggle_ready',
	START_GAME = 'start_game',
}

export enum BUILD_IN_SOCKET_GAME_EVENTS {
	CONNECTION = 'connection',
	DISCONNECT = 'disconnect',
	ERROR = 'error',
}
