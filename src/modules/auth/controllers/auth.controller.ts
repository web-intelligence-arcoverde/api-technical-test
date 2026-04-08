import type { RequestHandler } from "express";
import type { LoginUserUseCase } from "../usecases/login-user.usecase";
import type { RegisterUserUseCase } from "../usecases/register-user.usecase";

export class AuthController {
	constructor(
		private readonly registerUseCase: RegisterUserUseCase,
		private readonly loginUseCase: LoginUserUseCase,
	) {}

	register: RequestHandler = async (req, res, next) => {
		try {
			const result = await this.registerUseCase.execute(req.body);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	};

	login: RequestHandler = async (req, res, next) => {
		try {
			const result = await this.loginUseCase.execute(req.body);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};
}
