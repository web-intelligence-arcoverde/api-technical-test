import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { IController } from "../../core/interfaces/controller";
import type { IUseCase } from "../../use-cases/create-product.usecase";
import { deleteProductValidation } from "../../validations/delete-product.schema";

export class DeleteProductController implements IController {
	constructor(private readonly useCase: IUseCase) {}

	async handle(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<Response> {
		try {
			const validated = deleteProductValidation.parse({
				id: req.params.id,
			});

			const result = await this.useCase.execute(validated);

			if (!result) {
				return res.status(404).json({ error: "Product not found" });
			}

			return res
				.status(200)
				.json({ message: "Deleted Product successfully", result });
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
