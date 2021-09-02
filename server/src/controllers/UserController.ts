import { Controller } from './Controller';
import { NextFunction, Request, Response, Router } from 'express';
import { UserModel } from '../models/UserModel';
import { UserData } from '../models/UserModel';
import { HttpError } from '../errors/HttpError';
import { UserNotFoundError } from '../errors/user/UserNotFoundError';
import { UserDTO } from '../objects/user/UserDTO';
import { validationMiddleware } from '../middlewares/ValidationMiddleware';

export class UserController extends Controller {
	router = Router();
	path = '/users';

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(this.path, this.getAllUsers);
		this.router.get(`${this.path}/:id`, this.getUserById);
		this.router.patch(`${this.path}/:id`, this.modifyUser);
		this.router.delete(`${this.path}/:id`, this.deleteUser);
		this.router.post(
			this.path,
			validationMiddleware(UserDTO),
			this.createUser
		);
	}

	private getAllUsers = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			const users = await UserModel.find().exec();
			users ? res.json(users) : res.json([]);
		});
	};

	private getUserById = (req: Request, res: Response, next: NextFunction) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			const id = req.params.id;
			const user = await UserModel.findById(id).exec();
			user ? res.json(user) : next(new UserNotFoundError(id));
		});
	};

	private modifyUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			const id = req.params.id;
			const postData: UserData = req.body;
			const editedUser = await UserModel.findByIdAndUpdate(id, postData, {
				new: true,
			}).exec();
			editedUser ? res.json(editedUser) : next(new UserNotFoundError(id));
		});
	};

	private createUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			const postData: UserData = req.body;
			const createdUser = new UserModel(postData); //TODO: check if data is correct
			const savedUser = await createdUser.save();
			res.json(savedUser);
		});
	};

	private deleteUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			const id = req.params.id;
			const result = await UserModel.findByIdAndDelete(id).exec();
			result ? res.sendStatus(200) : next(new UserNotFoundError(id));
		});
	};
}
