import { Pool } from "pg";

const configAcessDatababse = {
	host: process.env.PG_HOST ?? "localhost",
	port: Number(process.env.PG_PORT) || 5432,
	user: process.env.PG_USER ?? "postgres",
	password: process.env.PG_PASSWORD ?? "",
	database: process.env.PG_DATABASE ?? "",
};

const pool = new Pool(configAcessDatababse);

export const connectDB = async () => {
	try {
		await pool.connect();
		console.log("PostgreSQL connected");
	} catch (err) {
		console.error("PostgreSQL connection error:", err);
		process.exit(1);
	}
};

export default {
	query: (text: string, params?: any[]) => pool.query(text, params),
};
