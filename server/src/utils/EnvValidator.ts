/* eslint-disable no-mixed-spaces-and-tabs */
import { cleanEnv, port, str } from 'envalid';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function validateEnv() {
	cleanEnv(process.env, {
		PROD_MODE: str(),
	});

	return process.env.PROD_MODE === 'true'
		? cleanEnv(process.env, {
				PROD_MODE: str(),
				MONGO_PASSWORD: str(),
				MONGO_PATH: str(),
				MONGO_USER: str(),
				PORT: port(),
		  })
		: cleanEnv(process.env, {
				PROD_MODE: str(),
				MONGO_PASSWORD: str(),
				MONGO_PATH: str(),
				MONGO_USER: str(),
				PORT: port(),
				CLIENT_PORT: port(),
		  });
}
