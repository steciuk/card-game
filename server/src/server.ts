import express from 'express';
import { Request, Response } from 'express';
const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get('/', (req: Request, res: Response) => {
	res.send('Hello world!');
});

// start the Express server
app.listen(port, () => {
	console.log(`server started and listening at http://localhost:${port}`);
});
