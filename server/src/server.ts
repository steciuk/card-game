import dotenv from 'dotenv';

import { App } from './App';
import { GameController } from './routers/GameRouter';
import { UserController } from './routers/UserRouter';
import { validateEnv } from './utils/EnvValidator';

dotenv.config();
validateEnv();

const app = new App([new UserController(), new GameController()]);
app.listen();
