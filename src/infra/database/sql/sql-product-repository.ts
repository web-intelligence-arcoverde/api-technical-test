import type { Product } from "../../../core/interfaces/product";
import type { IPagination } from "../../../core/repositories/pagination";
import type { IProductRepository } from "../../../core/repositories/product-repository";

import { db } from "./client";

export class SqlProductRepository implements IProductRepository {
	async findAll(page: number, limit: number): Promise<IPagination> {
		const offset = (page - 1) * limit;

		const query = `
          SELECT id, category, name, quantity, unit, checked
          FROM products
          ORDER BY id ASC
          LIMIT $1 OFFSET $2
        `;
		const countQuery = `
          SELECT COUNT(*) AS total
          FROM products
        `;
		const values = [limit, offset];

		try {
			const result = await db.query(query, values);

			const countResult = await db.query(countQuery);
			const total = parseInt(countResult.rows[0].total, 10);
			const totalPages = Math.ceil(total / limit);

			return {
				data: result.rows,
				total,
				totalPages,
				currentPage: page,
			};
		} catch (error) {
			console.error("Erro ao listar produtos:", error);
			throw error;
		}
	}

	async create(data: Product) {
		const { category, name, quantity, unit, checked } = data;

		const query = `
          INSERT INTO products (category, name, quantity, unit, checked)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, category, name, quantity, unit, checked
        `;
		const values = [category, name, quantity, unit, checked];

		try {
			const result = await db.query(query, values);
			return result.rows[0];
		} catch (error) {
			console.error("Erro ao criar produto:", error);
			throw error;
		}
	}

	async findById(id: number): Promise<Product | null> {
		const query = `
          SELECT id, category, name, quantity, unit, checked
          FROM products
          WHERE id = $1
        `;

		try {
			const result = await db.query(query, [id]);
			return result.rows[0] || null;
		} catch (error) {
			console.error("Erro ao buscar produto por ID:", error);
			throw error;
		}
	}

	async toggleProductChecked(id: number, checked: boolean): Promise<void> {
		const query = `
          UPDATE products
          SET checked = $1
          WHERE id = $2
          RETURNING id, category, name, quantity, unit, checked
        `;

		try {
			const result = await db.query(query, [checked, id]);
			return result.rows[0];
		} catch (error) {
			console.error("Erro ao atualizar campo checked:", error);
			throw error;
		}
	}

	async delete(id: number): Promise<void> {
		const query = `
          DELETE FROM products
          WHERE id = $1
          RETURNING id, category, name, quantity, unit, checked
        `;

		try {
			const result = await db.query(query, [id]);
			return result.rows[0] || null; // Retorna o produto deletado ou null se não encontrado
		} catch (error) {
			console.error("Erro ao deletar produto:", error);
			throw error;
		}
	}
}
