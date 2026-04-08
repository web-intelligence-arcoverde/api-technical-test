import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	limit: 100, // Limite de 100 requisições por IP por janela
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: {
		error: "Too many requests, please try again later.",
	},
});
