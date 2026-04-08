import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	type UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../infra/firestore";

export interface IAuthRepository {
	register(
		email: string,
		password: string,
		name: string,
	): Promise<UserCredential>;
	login(email: string, password: string): Promise<UserCredential>;
	logout(): Promise<void>;
	resetPassword(email: string): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
	async register(
		email: string,
		password: string,
		name: string,
	): Promise<UserCredential> {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const user = userCredential.user;

		// Create user document in Firestore
		await setDoc(doc(db, "users", user.uid), {
			uid: user.uid,
			email: user.email,
			name: name,
			createdAt: new Date(),
		});

		return userCredential;
	}

	async login(email: string, password: string): Promise<UserCredential> {
		return await signInWithEmailAndPassword(auth, email, password);
	}

	async logout(): Promise<void> {
		await signOut(auth);
	}

	async resetPassword(email: string): Promise<void> {
		await sendPasswordResetEmail(auth, email);
	}
}
