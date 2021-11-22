export type SOCKET_EVENTS = SOCKET_GAME_EVENTS | BUILD_IN_SOCKET_GAME_EVENTS;

export enum SOCKET_GAME_EVENTS {
	PLAYER_CONNECTED = 'player_connected',
	PLAYER_DISCONNECTED = 'player_disconnected',
	PLAYERS_IN_GAME = 'players_in_game',
	PLAYER_TOGGLE_READY = 'player_toggle_ready',
}

export enum BUILD_IN_SOCKET_GAME_EVENTS {
	CONNECT = 'connect',
	CONNECT_ERROR = 'connect_error',
}
