import type { Request, Response } from "express";
import { ToggleCheckedProductController } from "../../controllers/toggle-checked-product.controller";
import { setupControllerTest } from "../helpers/setup.helper";

describe("ToggleCheckedProductController", () => {
	it("should toggle product checked and return 200", async () => {
		const { controller, mockUseCase, req, res, next } = setupControllerTest(
			ToggleCheckedProductController,
		);

		req.params = { id: "prod-1" };
		req.body = { checked: true };
		const result = { id: "prod-1", checked: true };
		mockUseCase.execute.mockResolvedValue(result);

		await controller.handle(req as Request, res as Response, next);

		expect(mockUseCase.execute).toHaveBeenCalledWith({
			id: "prod-1",
			checked: true,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Product updated successfully",
			result,
		});
	});

	it("should return 400 if checked is missing", async () => {
		const { controller, req, res, next } = setupControllerTest(
			ToggleCheckedProductController,
		);

		req.params = { id: "prod-1" };
		req.body = {}; // checked missing

		await controller.handle(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(400);
	});
});
