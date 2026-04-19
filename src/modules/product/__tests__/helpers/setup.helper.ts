import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import type { IUseCase } from "../../usecases/usecase.interface";

export const setupControllerTest = (ControllerClass: any) => {
	const mockUseCase = {
		execute: jest.fn(),
	} as unknown as jest.Mocked<IUseCase>;

	const controller = new ControllerClass(mockUseCase);

	const req: Partial<Request> = {
		query: {},
		params: {},
		body: {},
	};
	const res: Partial<Response> = {
		status: jest.fn().mockReturnThis() as any,
		json: jest.fn().mockReturnThis() as any,
	};
	const next: NextFunction = jest.fn() as any;

	return {
		controller,
		mockUseCase,
		req,
		res,
		next,
	};
};
