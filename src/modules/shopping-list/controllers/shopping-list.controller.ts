import type { RequestHandler } from "express";
import { z } from "zod";
import type { CreateListUseCase } from "../usecases/create-list.usecase";
import type { ListListsUseCase } from "../usecases/list-lists.usecase";
import type { GetListUseCase } from "../usecases/get-list.usecase";
import type { UpdateListUseCase } from "../usecases/update-list.usecase";
import type { DeleteListUseCase } from "../usecases/delete-list.usecase";
import type { AddProductToListUseCase } from "../usecases/add-product-to-list.usecase";
import { createListSchema } from "../validations/create-list.schema";
import { updateListSchema } from "../validations/update-list.schema";
import { addProductSchema } from "../validations/add-product.schema";

export class ShoppingListController {
	constructor(
		private readonly createListUseCase: CreateListUseCase,
		private readonly listListsUseCase: ListListsUseCase,
		private readonly getListUseCase: GetListUseCase,
		private readonly updateListUseCase: UpdateListUseCase,
		private readonly deleteListUseCase: DeleteListUseCase,
		private readonly addProductToListUseCase: AddProductToListUseCase,
	) { }

	create: RequestHandler = async (req, res, next) => {
		try {
			const data = createListSchema.parse(req.body);
			const result = await this.createListUseCase.execute({
				...data,
				userId: (req as any).user.uid,
			});
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	};

	list: RequestHandler = async (req, res, next) => {
		try {
			const userId = (req as any).user.uid;
			const result = await this.listListsUseCase.execute(userId);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};

	getById: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params;
			const result = await this.getListUseCase.execute(id);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};

	update: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params;
			const data = updateListSchema.parse(req.body);
			await this.updateListUseCase.execute(id, data);
			res.status(200).json({ message: "Lista atualizada com sucesso" });
		} catch (error) {
			next(error);
		}
	};

	delete: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params;
			await this.deleteListUseCase.execute(id);
			res.status(200).json({ message: "Lista deletada com sucesso" });
		} catch (error) {
			next(error);
		}
	};

	addProduct: RequestHandler = async (req, res, next) => {
		try {
			const { id } = req.params;
			const userId = (req as any).user.uid;
			const data = addProductSchema.parse(req.body);
			const result = await this.addProductToListUseCase.execute(
				id,
				userId,
				data as any,
			);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	};
}
