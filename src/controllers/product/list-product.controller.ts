import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { IController } from "../../core/interfaces/controller";
import type { IUseCase } from "../../use-cases/create-product.usecase";
import { listProductValidation } from "../../validations/list-product.schema";

export class ListProductController implements IController {
	constructor(private readonly useCase: IUseCase) {}

	async handle(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response> {
		try {
			const data = listProductValidation.parse(req.query);
			const result = await this.useCase.execute(data);
			return res.status(201).json(result);
		} catch (err) {
			next(err);
			if (err instanceof z.ZodError) {
				return res
					.status(400)
					.json({ error: "Invalid input", issues: err.issues });
			}

			return res.status(500).json({ error: "Internal server error" });
		}
	}
}
