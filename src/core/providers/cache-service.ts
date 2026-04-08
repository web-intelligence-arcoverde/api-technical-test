export interface ICacheProvider {
	get<T = any>(key: string): Promise<T | null>;
	set(key: string, value: any, ttl?: number): Promise<void>;
	del(key: string): Promise<void>;
	invalidateByPattern(pattern: string): Promise<void>;
}
