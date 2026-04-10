import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
	// Configuração para evitar problemas de timeout em conexões de longa duração
	// Isso é importante para operações como SCAN que podem levar mais tempo
	retryStrategy: (times) => {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
	// Desabilita o modo pipeline por padrão para evitar consumo excessivo de memória
	// O pipeline será usado apenas quando necessário nas operações específicas
	enableReadyCheck: false,
	enableOfflineQueue: false,
});

export default redis;
