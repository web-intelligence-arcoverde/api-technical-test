import redis from "../../config/redis";
import type { ICacheProvider } from "../../core/providers/cache-service";

export class RedisCacheProvider implements ICacheProvider {
	async get<T = any>(key: string): Promise<T | null> {
		const data = await redis.get(key);
		return data ? JSON.parse(data) : null;
	}

	async set(key: string, value: any, ttl = 60 * 5): Promise<void> {
		await redis.set(key, JSON.stringify(value), "EX", ttl);
	}

	async del(key: string): Promise<void> {
		await redis.del(key);
	}

	async invalidateByPattern(pattern: string): Promise<void> {
		const keys = await redis.keys(pattern);
		if (keys.length > 0) {
			await redis.del(...keys);
		}
	}
}
