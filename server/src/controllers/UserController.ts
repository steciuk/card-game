import { NextFunction, Request, Response } from 'express';

import { InvalidCredentialsError } from '../errors/httpErrors/user/InvalidCredentialsError';
import { UserExistsError } from '../errors/httpErrors/user/UserExistsError';
import {
	generateNewSaltAndHash,
	issueJWT,
	validatePassword
} from '../lib/passport/PassportUtils';
import { dtoValidationMiddleware } from '../middlewares/DTOValidationMiddleware';
import { UserDTO, UserModel } from '../models/UserModel';
import { AccessDatabaseFromMiddleware } from '../utils/decorators/DatabaseOperationsHandler';
import { Controller } from './Controller';

export class UserController extends Controller {
	protected path = '/users';

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		// this.router.get(this.path, this.getAllUsers);
		// this.router.get(`${this.path}/:id`, this.getUserById);
		// this.router.patch(`${this.path}/:id`, this.modifyUser);
		// this.router.delete(`${this.path}/:id`, this.deleteUser);
		this.router.post(`${this.path}/register`, dtoValidationMiddleware(UserDTO), this.registerUser);
		this.router.post(`${this.path}/login`, dtoValidationMiddleware(UserDTO), this.loginUser);
		this.router.get(`${this.path}/protected`, this.protected);
	}

	private async protected(_req: Request, _res: Response, _next: NextFunction): Promise<void> {
		console.log();
	}

	@AccessDatabaseFromMiddleware()
	private async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const postData: UserDTO = req.body;
		const user = await UserModel.findOne({
			username: postData.username,
		});
		if (user) return next(new UserExistsError(postData.username));

		const { salt, hash } = generateNewSaltAndHash(postData.password);
		const createdUser = new UserModel({
			username: postData.username,
			hash: hash,
			salt: salt,
		});

		const savedUser = await createdUser.save();
		const { token, expiresIn } = issueJWT(savedUser);
		res.json({
			user: { id: savedUser.id, username: savedUser.username },
			token: token,
			expiresIn: expiresIn,
		});
	}

	@AccessDatabaseFromMiddleware()
	private async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		const postData: UserDTO = req.body;
		const user = await UserModel.findOne({
			username: postData.username,
		});
		if (!user) return next(new InvalidCredentialsError());
		if (!validatePassword(postData.password, user.hash, user.salt))
			return next(new InvalidCredentialsError());

		const { token, expiresIn } = issueJWT(user);
		res.json({
			user: { id: user.id, username: user.username },
			token: token,
			expiresIn: expiresIn,
		});
	}

	// private getAllUsers = async (
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction
	// ) => {
	// 	this.handleRequest(req, res, next, async (req, res, next) => {
	// 		const users = await UserModel.find();
	// 		users ? res.json(users) : res.json([]);
	// 	});
	// };

	// private getUserById = (req: Request, res: Response, next: NextFunction) => {
	// 	this.handleRequest(req, res, next, async (req, res, next) => {
	// 		const id = req.params.id;
	// 		const user = await UserModel.findById(id);
	// 		user ? res.json(user) : next(new UserNotFoundError(id));
	// 	});
	// };

	// private modifyUser = async (
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction
	// ) => {
	// 	this.handleRequest(req, res, next, async (req, res, next) => {
	// 		const id = req.params.id;
	// 		const postData: UserDTO = req.body;
	// 		const editedUser = await UserModel.findByIdAndUpdate(id, postData, {
	// 			new: true,
	// 		});
	// 		editedUser ? res.json(editedUser) : next(new UserNotFoundError(id));
	// 	});
	// };

	// private deleteUser = async (
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction
	// ) => {
	// 	this.handleRequest(req, res, next, async (req, res, next) => {
	// 		const id = req.params.id;
	// 		const result = await UserModel.findByIdAndDelete(id);
	// 		result ? res.sendStatus(200) : next(new UserNotFoundError(id));
	// 	});
	// };
}
