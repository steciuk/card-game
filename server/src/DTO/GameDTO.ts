import {
	IsEnum,
	IsInt,
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
import { GAME_TYPE } from '../game/GameTypes';

export class GameDTO {
	@IsEnum(GAME_TYPE)
	gameType!: GAME_TYPE;

	@IsInt()
	@Min(2)
	@Max(8)
	maxPlayers!: number;

	@IsString()
	@MinLength(3)
	@MaxLength(20)
	@Matches(ALPHANUMERIC_UNDERSCORE_REGEX)
	roomName!: string;

	@IsString()
	@MinLength(3)
	@MaxLength(20)
	@IsOptional()
	@Matches(ALPHANUMERIC_SPECIAL_REGEX)
	password?: string;
}
