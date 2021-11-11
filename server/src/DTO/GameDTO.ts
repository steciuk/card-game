import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min
} from 'class-validator';

import { GameTypes } from '../game/GameTypes';

export class GameDTO {
	@IsEnum(GameTypes)
	gameType: GameTypes;

	@IsNumber()
	@Min(2)
	@Max(8)
	maxPlayers: number;

	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	password?: string;
}
