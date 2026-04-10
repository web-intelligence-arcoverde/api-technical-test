import { Queue } from "bullmq";
import Redis from "ioredis";

export const queueRedisConnection = new Redis(
	process.env.REDIS_URL ?? "redis://localhost:6379",
	{
		maxRetriesPerRequest: null,
	},
);

export const bulkInsertQueue = new Queue("bulk-insert-products", {
	connection: queueRedisConnection,
});
