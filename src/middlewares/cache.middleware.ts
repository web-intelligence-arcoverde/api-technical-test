import type { NextFunction, Request, Response } from "express";
import { getCache, setCache } from "../infra/cache/redis.helper";
import logger from "../infra/logger/logger";

export interface CacheRequest extends Request {
	user?: {
		uid: string;
		email: string;
	};
}

export const cacheMiddleware = (
	keyGenerator: (req: CacheRequest) => string,
	ttlSeconds: number,
) => {
	return async (req: CacheRequest, res: Response, next: NextFunction) => {
		const key = keyGenerator(req);

		try {
			const cachedData = await getCache(key);

			if (cachedData) {
				logger.http(`[Cache] HIT for key: ${key}`);
				res.json(cachedData);
				return;
			}

			logger.http(`[Cache] MISS for key: ${key}`);

			// Intercepta o res.json para salvar no cache ao responder
			const originalJson = res.json.bind(res);

			// biome-ignore lint/suspicious/noExplicitAny: Standard response body type
			res.json = (body: any) => {
				// Só salva no cache se o status for sucesso (200 ou 201)
				if (res.statusCode >= 200 && res.statusCode < 300) {
					setCache(key, body, ttlSeconds).catch((err) =>
						logger.error(
							`[Redis] Error saving cache for key ${key}: ${err.message}`,
						),
					);
				}
				return originalJson(body);
			};

			next();
		} catch (error) {
			logger.error(`[Redis] Error in Cache Middleware for key ${key}:`, error);
			next();
		}
	};
};
