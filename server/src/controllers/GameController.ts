import { NextFunction, Request, Response } from 'express';

import { GameDTO } from '../DTO/GameDTO';
import { GameResponseDTO } from '../DTO/GameResponseDTO';
import { BadRequestError } from '../errors/httpErrors/BadRequestError';
import {
	DB_RESOURCES,
	ResourceNotFoundError
} from '../errors/httpErrors/ResourceNotFoundError';
import { dtoValidationMiddleware } from '../middlewares/DtoValidationMiddleware';
import { jwtAuthMiddleware } from '../middlewares/JwtAuthMiddleware';
import { GameModel } from '../models/GameModel';
import { UserModel } from '../models/UserModel';
import { AccessDatabaseFromMiddleware } from '../utils/decorators/DatabaseOperationsHandler';
import { Controller } from './Controller';

export class GameController extends Controller {
	path = '/games';

	constructor() {
		super();
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.get('', jwtAuthMiddleware, this.getAllGames);
		this.router.get('/:gameId', jwtAuthMiddleware, this.getGame);
		this.router.post('', jwtAuthMiddleware, dtoValidationMiddleware(GameDTO), this.addGame);
	}

	@AccessDatabaseFromMiddleware()
	private async getAllGames(req: Request, res: Response, _next: NextFunction): Promise<void> {
		const games = await GameModel.find();
		games ? res.json(games.map(GameResponseDTO.fromGameDocument)) : res.json([]);
	}

	@AccessDatabaseFromMiddleware()
	private async addGame(req: Request, res: Response, next: NextFunction): Promise<void> {
		const postData: GameDTO = req.body;

		if (!req.jwt) return next(new BadRequestError());
		const userId = req.jwt.sub as string;
		const owner = await UserModel.findById(userId);
		if (!owner) return next(new ResourceNotFoundError(DB_RESOURCES.USER, userId));

		const createdGame = new GameModel({
			gameType: postData.gameType,
			ownerId: owner._id,
			ownerName: owner.username,
			maxPlayers: postData.maxPlayers,
			name: postData.name,
			created: Date.now(),
		});
		if (postData.password) createdGame.password = postData.password;

		const savedGame = await createdGame.save();
		res.json(GameResponseDTO.fromGameDocument(savedGame));
	}

	@AccessDatabaseFromMiddleware()
	private async getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = req.params.gameId;
		const game = await GameModel.findById(id);
		if (!game) return next(new ResourceNotFoundError(DB_RESOURCES.GAME, id));
		res.json(GameResponseDTO.fromGameDocument(game));
	}
}
