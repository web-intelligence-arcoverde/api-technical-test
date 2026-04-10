import type { Request, Response, NextFunction } from "express";
import { auth } from "../infra/firestore";

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).json({ error: "No token provided" });
		return;
	}

	const token = authHeader.split(" ")[1];

	try {
		const decodedToken = await auth.verifyIdToken(token);
		// biome-ignore lint/suspicious/noExplicitAny: Adding user to request object
		(req as any).user = {
			uid: decodedToken.uid,
			email: decodedToken.email,
		};
		next();
	} catch (error) {
		res.status(401).json({ error: "Invalid or expired token" });
		return;
	}
};
