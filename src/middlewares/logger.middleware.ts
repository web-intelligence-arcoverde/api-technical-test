import type { NextFunction, Request, Response } from "express";
import logger from "../infra/logger/logger";

/**
 * Middleware para registrar todas as requisições HTTP recebidas pela API.
 * Captura Método, URL, Status Code e o tempo total de processamento.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const start = Date.now();

	// Intercepta o final da resposta para calcular a latência e status real
	res.on("finish", () => {
		const duration = Date.now() - start;
		const { method, originalUrl } = req;
		const { statusCode } = res;

		let logLevel = "info";
		if (statusCode >= 400) logLevel = "warn";
		if (statusCode >= 500) logLevel = "error";

		logger.log(
			logLevel,
			`${method} ${originalUrl} ${statusCode} - ${duration}ms`,
		);
	});

	next();
}
