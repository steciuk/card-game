import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

import {
	ALPHANUMERIC_SPECIAL_REGEX,
	ALPHANUMERIC_UNDERSCORE_REGEX
} from '../Const';

export class UserDTO {
	@IsString()
	@MinLength(6)
	@MaxLength(20)
	@Matches(ALPHANUMERIC_UNDERSCORE_REGEX)
	username!: string;

	@IsString()
	@MinLength(6)
	@MaxLength(20)
	@Matches(ALPHANUMERIC_SPECIAL_REGEX)
	password!: string;
}
