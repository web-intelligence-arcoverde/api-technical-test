import type { Request, Response } from "express";
import { ListProductController } from "../../controllers/list-product.controller";
import { setupControllerTest } from "../helpers/setup.helper";

describe("ListProductController", () => {
	it("should list products and return 200", async () => {
		const { controller, mockUseCase, req, res, next } = setupControllerTest(
			ListProductController,
		);

		req.query = { listId: "list-123", page: "1", limit: "10" };
		const mockResult = { items: [], total: 0 };
		mockUseCase.execute.mockResolvedValue(mockResult);

		await controller.handle(req as Request, res as Response, next);

		expect(mockUseCase.execute).toHaveBeenCalledWith({
			listId: "list-123",
			page: 1,
			limit: 10,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(mockResult);
	});

	it("should return 400 if listId is missing", async () => {
		const { controller, req, res, next } = setupControllerTest(
			ListProductController,
		);

		req.query = { page: "1" }; // listId missing

		await controller.handle(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				error: "Invalid input",
			}),
		);
	});
});
