import { cleanEnv, port, str } from 'envalid';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function validateEnv() {
	return cleanEnv(process.env, {
		MONGO_PASSWORD: str(),
		MONGO_PATH: str(),
		MONGO_USER: str(),
		PORT: port(),
		CLIENT_PORT: port(),
	});
}
