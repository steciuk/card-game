import { AbstractController } from './AbstractController';
import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';

export class UserController extends AbstractController {
	constructor() {
		super('/users');
		this.initializeRoutes();
	}

	initializeRoutes(): void {
		this.router.get(this.path, this.getUsers);
		this.router.post(this.path, this.saveUser);
	}

	getUsers = (req: Request, res: Response) => {
		res.send('Hello World');
	};

	saveUser = async (req: Request, res: Response) => {
		const user = new UserModel(req.body);
		try {
			const newUser = await user.save();
			res.json(newUser);
		} catch (error) {
			console.log(error);
		}
	};
}
