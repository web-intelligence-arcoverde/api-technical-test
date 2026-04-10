import { Queue } from "bullmq";
import { queueRedisConnection } from "./queue.config";

export const SHOPPING_LIST_JOBS = {
	CREATE_LIST: "CREATE_LIST",
	ADD_PRODUCT: "ADD_PRODUCT",
} as const;

export const shoppingListQueue = new Queue("shopping-list-queue", {
	connection: queueRedisConnection,
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 1000,
		},
		removeOnComplete: true,
	},
});
