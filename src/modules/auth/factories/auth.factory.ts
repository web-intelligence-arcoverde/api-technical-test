import { AuthController } from "../controllers/auth.controller";
import { AuthRepository } from "../repositories/auth.repository";
import { LoginUserUseCase } from "../usecases/login-user.usecase";
import { RegisterUserUseCase } from "../usecases/register-user.usecase";

export class AuthControllerFactory {
	static make(): AuthController {
		const authRepository = new AuthRepository();
		const registerUseCase = new RegisterUserUseCase(authRepository);
		const loginUseCase = new LoginUserUseCase(authRepository);

		return new AuthController(registerUseCase, loginUseCase);
	}
}
