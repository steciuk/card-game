import dotenv from 'dotenv';
import express from 'express';
import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 8080);

app.get('/', (req: Request, res: Response) => {
	res.send('Hello world!');
});

const listener = app.listen(() => {
	console.log(`server started and listening...`);
});

const io = new Server(listener);
