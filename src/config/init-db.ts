import database from "./database";

export async function initDB() {
	const createProductTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      unit VARCHAR(50) NOT NULL,
      checked BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

	try {
		await database.query(createProductTableQuery);
		console.log('✅ Tabela "products" verificada/criada com sucesso.');
	} catch (error) {
		console.error("❌ Erro ao criar a tabela products:", error);
		process.exit(1);
	}
}
