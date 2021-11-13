import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	Matches,
	Max,
	MaxLength,
	Min,
	MinLength
} from 'class-validator';

import {
	ALPHANUMERIC_SPECIAL_REGEX,
	ALPHANUMERIC_UNDERSCORE_REGEX
} from '../Const';
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
	@Matches(ALPHANUMERIC_UNDERSCORE_REGEX)
	roomName: string;

	@IsString()
	@MinLength(3)
	@MaxLength(20)
	@IsOptional()
	@Matches(ALPHANUMERIC_SPECIAL_REGEX)
	password?: string;
}
