import type { RequestHandler } from "express";
import { z } from "zod";
import type { IUseCase } from "../usecases/usecase.interface";
import { listProductValidation } from "../validations/list-product.schema";
import type { IController } from "./controller.interface";

export class ListProductController implements IController {
	constructor(private readonly useCase: IUseCase) {}

	handle: RequestHandler = async (req, res, next) => {
		try {
			const data = listProductValidation.parse(req.query);
			const result = await this.useCase.execute(data);
			res.status(200).json(result);
		} catch (err) {
			if (err instanceof z.ZodError) {
				res.status(400).json({ error: "Invalid input", issues: err.issues });
				return;
			}
			next(err);
		}
	};
}
