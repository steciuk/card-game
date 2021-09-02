import dotenv from 'dotenv';

import { App } from './App';
import { UserController } from './controllers/UserController';
import { validateEnv } from './utils/EnvValidator';

dotenv.config();
validateEnv();

const app = new App([new UserController()]);
app.listen();

// const io = new Server(listener);
