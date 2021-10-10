import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';

import { UserExistsError } from '../errors/httpErrors/user/UserExistsError';
import { UserNotFoundError } from '../errors/httpErrors/user/UserNotFoundError';
import { generateNewSaltAndHash } from '../lib/PassportUtils';
import { dtoValidationMiddleware } from '../middlewares/DTOValidationMiddleware';
import { UserDTO, UserModel } from '../models/UserModel';
import { Controller } from './Controller';

export class UserController extends Controller {
	router = Router();
	path = '/users';

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes() {
		// this.router.get(this.path, this.getAllUsers);
		// this.router.get(`${this.path}/:id`, this.getUserById);
		// this.router.patch(`${this.path}/:id`, this.modifyUser);
		// this.router.delete(`${this.path}/:id`, this.deleteUser);
		this.router.post(
			`${this.path}/register`,
			dtoValidationMiddleware(UserDTO),
			this.registerUser
		);
		this.router.post(
			`${this.path}/login`,
			dtoValidationMiddleware(UserDTO),
			passport.authenticate('basic', { session: false }),
			this.loginUser
		);
	}

	private getAllUsers = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			const users = await UserModel.find();
			users ? res.json(users) : res.json([]);
		});
	};

	private getUserById = (req: Request, res: Response, next: NextFunction) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			const id = req.params.id;
			const user = await UserModel.findById(id);
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
			const postData: UserDTO = req.body;
			const editedUser = await UserModel.findByIdAndUpdate(id, postData, {
				new: true,
			});
			editedUser ? res.json(editedUser) : next(new UserNotFoundError(id));
		});
	};

	private registerUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			const postData: UserDTO = req.body;
			const user = await UserModel.findOne({
				username: postData.username,
			});
			if (user) next(new UserExistsError(postData.username));

			const { salt, hash } = generateNewSaltAndHash(postData.password);
			const createdUser = new UserModel({
				username: postData.username,
				hash: hash,
				salt: salt,
			});

			const savedUser = await createdUser.save();
			res.json(savedUser.id);
		});
	};

	private loginUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			res.status(200).send('Elo');
		});
	};

	private deleteUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		this.handleRequest(req, res, next, async (req, res, next) => {
			const id = req.params.id;
			const result = await UserModel.findByIdAndDelete(id);
			result ? res.sendStatus(200) : next(new UserNotFoundError(id));
		});
	};
}
