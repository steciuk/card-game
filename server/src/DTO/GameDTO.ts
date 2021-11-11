import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength
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
	@MinLength(3)
	@MaxLength(20)
	roomName: string;

	@IsString()
	@MinLength(3)
	@MaxLength(20)
	@IsOptional()
	password?: string;
}
