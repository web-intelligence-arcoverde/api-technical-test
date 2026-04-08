import type { IAuthRepository } from "../repositories/auth.repository";

export interface ILoginData {
	email: string;
	password: string;
}

export class LoginUserUseCase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute(data: ILoginData) {
		const { email, password } = data;
		const userCredential = await this.authRepository.login(email, password);
		const user = userCredential.user;
		const token = await user.getIdToken();

		return {
			uid: user.uid,
			email: user.email,
			token: token,
		};
	}
}
