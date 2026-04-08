import type { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "../config/redis";

const rateLimiter = new RateLimiterRedis({
	storeClient: redis,
	keyPrefix: "rateLimiter",
	points: Number(process.env.RATE_LIMIT_REQUEST) || 10, // número de requisições
	duration: Number(process.env.RATE_LIMIT_DURATION) || 60, // por 60 segundos por IP
});

const rateLimiterMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	rateLimiter
		.consume(req.ip ?? "unknown")
		.then(() => {
			next();
		})
		.catch(() => {
			res.status(429).json({
				message: "Too many requests. Please try again later.",
			});
		});
};

export default rateLimiterMiddleware;
