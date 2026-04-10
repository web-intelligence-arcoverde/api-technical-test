import redis from "../../config/redis";

/**
 * Invalida as chaves do redis que correspondem ao padrão passado usando SCAN.
 * É seguro para produção pois não bloqueia o event loop do Redis.
 */
export const invalidateCacheByPattern = async (
	pattern: string,
): Promise<void> => {
	let cursor = "0";

	do {
		// SCAN retorna um cursor para a próxima iteração e um array com as chaves encontradas
		const [nextCursor, keys] = await redis.scan(
			cursor,
			"MATCH",
			pattern,
			"COUNT",
			100, // Processa 100 chaves por vez para não sobrecarregar a memória e a rede
		);

		cursor = nextCursor;

		if (keys.length > 0) {
			// Usa o pipeline para enviar os comandos de exclusão em lote de forma otimizada
			const pipeline = redis.pipeline();
			for (const key of keys) {
				pipeline.del(key);
			}
			await pipeline.exec();
		}
	} while (cursor !== "0"); // Quando o cursor retorna "0", a varredura terminou
};

/**
 * Busca um valor no cache e realiza o parse de JSON.
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
	const data = await redis.get(key);
	if (!data) return null;
	try {
		return JSON.parse(data) as T;
	} catch (error) {
		console.error(
			`[Redis] Erro ao fazer parse do cache para a chave ${key}:`,
			error,
		);
		return null;
	}
};

/**
 * Salva um valor no cache com expiração opcional.
 */
export const setCache = async (
	key: string,
	value: unknown,
	ttlSeconds?: number,
): Promise<void> => {
	const data = JSON.stringify(value);
	if (ttlSeconds) {
		await redis.set(key, data, "EX", ttlSeconds);
	} else {
		await redis.set(key, data);
	}
};
