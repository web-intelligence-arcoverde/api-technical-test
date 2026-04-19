import type { Request, Response } from "express";
import { CreateProductController } from "../../controllers/create-product.controller";
import { setupControllerTest } from "../helpers/setup.helper";

describe("CreateProductController", () => {
	it("should create a product and return 201", async () => {
		const { controller, mockUseCase, req, res, next } = setupControllerTest(
			CreateProductController,
		);

		const productData = {
			name: "Test Product",
			category: "Food",
			marketName: "Test Market",
			price: 10,
			quantity: 1,
			unit: "un",
			checked: false,
			listId: "list-123",
		};
		req.body = productData;

		const mockResult = { id: "prod-1", ...productData };
		mockUseCase.execute.mockResolvedValue(mockResult);

		await controller.handle(req as Request, res as Response, next);

		expect(mockUseCase.execute).toHaveBeenCalledWith(productData);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(mockResult);
	});

	it("should return 400 if validation fails", async () => {
		const { controller, req, res, next } = setupControllerTest(
			CreateProductController,
		);

		req.body = { name: "" }; // Invalid: name is required and cannot be empty

		await controller.handle(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				error: "Invalid input",
			}),
		);
	});
});
