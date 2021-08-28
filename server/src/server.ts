import dotenv from 'dotenv';
import express from 'express';
import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';

dotenv.config();
const port = process.env.SERVER_PORT;
const app = express();

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

const listener = app.listen(port, () => {
	console.log(`server started and listening...`);
});

const io = new Server(listener);
