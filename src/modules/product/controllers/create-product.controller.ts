import type { RequestHandler } from "express";
import { z } from "zod";
import type { IUseCase } from "../usecases/usecase.interface";
import { createProductSchema } from "../validations/create-product.schema";
import type { IController } from "./controller.interface";

export class CreateProductController implements IController {
	constructor(private readonly useCase: IUseCase) {}

	handle: RequestHandler = async (req, res, next) => {
		try {
			const data = createProductSchema.parse(req.body);
			const result = await this.useCase.execute(data);

			res.status(201).json(result);
		} catch (err) {
			if (err instanceof z.ZodError) {
				res.status(400).json({ error: "Invalid input", issues: err.issues });
				return;
			}
			next(err);
		}
	};
}
