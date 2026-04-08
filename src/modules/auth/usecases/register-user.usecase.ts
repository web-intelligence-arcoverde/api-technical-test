import type { IAuthRepository } from "../repositories/auth.repository";

export interface IRegisterData {
	email: string;
	password: string;
	name: string;
}

export class RegisterUserUseCase {
	constructor(private readonly authRepository: IAuthRepository) {}

	async execute(data: IRegisterData) {
		const { email, password, name } = data;
		const userCredential = await this.authRepository.register(
			email,
			password,
			name,
		);
		const user = userCredential.user;
		const token = await user.getIdToken();

		return {
			uid: user.uid,
			email: user.email,
			name: name,
			token: token,
		};
	}
}
