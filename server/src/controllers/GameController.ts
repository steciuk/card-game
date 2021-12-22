import { NextFunction, Request, Response } from 'express';

import { GameDTO } from '../DTO/GameDTO';
import { GameResponseDTO } from '../DTO/GameResponseDTO';
import { BadRequestError } from '../errors/httpErrors/BadRequestError';
import {
	DB_RESOURCES,
	ResourceNotFoundError
} from '../errors/httpErrors/ResourceNotFoundError';
import { GameFactory } from '../game/gameStore/GameFactory';
import { GamesStore } from '../game/gameStore/GamesStore';
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

	private getAllGames(req: Request, res: Response, _next: NextFunction): void {
		res.json(GamesStore.Instance.allNotStartedGamesAsArray.map(GameResponseDTO.fromGame));
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
			maxPlayers: postData.maxPlayers,
			roomName: postData.roomName,
			created: Date.now(),
			isPasswordProtected: !!postData.password,
		});
		const savedGame = await createdGame.save();

		const game = GameFactory.createGameObject(
			savedGame.gameType,
			{ id: owner.id, username: owner.username },
			savedGame.maxPlayers,
			savedGame.roomName,
			createdGame.isPasswordProtected,
			savedGame.created,
			savedGame.id,
			postData.password
		);
		GamesStore.Instance.addGame(game);

		res.json(GameResponseDTO.fromGame(game));
	}

	@AccessDatabaseFromMiddleware()
	private async getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
		const gameId = req.params.gameId;
		const game = GamesStore.Instance.getGame(gameId);
		if (!game) return next(new ResourceNotFoundError(DB_RESOURCES.GAME, gameId));
		res.json(GameResponseDTO.fromGame(game));
	}
}
