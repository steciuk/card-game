import { cleanEnv, str, port } from 'envalid';

export function validateEnv() {
	return cleanEnv(process.env, {
		MONGO_PASSWORD: str(),
		MONGO_PATH: str(),
		MONGO_USER: str(),
		PORT: port(),
	});
}
