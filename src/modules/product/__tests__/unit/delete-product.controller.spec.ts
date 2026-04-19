import type { Request, Response } from "express";
import { DeleteProductController } from "../../controllers/delete-product.controller";
import { setupControllerTest } from "../helpers/setup.helper";

describe("DeleteProductController", () => {
	it("should delete a product and return 200", async () => {
		const { controller, mockUseCase, req, res, next } = setupControllerTest(
			DeleteProductController,
		);

		req.params = { id: "prod-1" };
		mockUseCase.execute.mockResolvedValue(undefined);

		await controller.handle(req as Request, res as Response, next);

		expect(mockUseCase.execute).toHaveBeenCalledWith({ id: "prod-1" });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: "Deleted Product successfully",
			result: undefined,
		});
	});

	it("should call next with error if use case fails", async () => {
		const { controller, mockUseCase, req, res, next } = setupControllerTest(
			DeleteProductController,
		);

		req.params = { id: "prod-1" };
		const error = new Error("Delete failed");
		mockUseCase.execute.mockRejectedValue(error);

		await controller.handle(req as Request, res as Response, next);

		expect(next).toHaveBeenCalledWith(error);
	});
});
