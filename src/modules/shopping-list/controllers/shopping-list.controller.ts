import type { RequestHandler } from "express";
import type { CreateListUseCase } from "../usecases/create-list.usecase";
import type { ListListsUseCase } from "../usecases/list-lists.usecase";

export class ShoppingListController {
	constructor(
		private readonly createListUseCase: CreateListUseCase,
		private readonly listListsUseCase: ListListsUseCase,
	) {}

	create: RequestHandler = async (req, res, next) => {
		try {
			const { name, userId } = req.body;
			const result = await this.createListUseCase.execute({ name, userId });
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	};

	list: RequestHandler = async (req, res, next) => {
		try {
			const { userId } = req.query;
			if (!userId) {
				res.status(400).json({ error: "userId is required" });
				return;
			}
			const result = await this.listListsUseCase.execute(userId as string);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};
}
