import { z } from "zod";

export const addProductSchema = z.object({
	category: z.string().min(1, "A categoria é obrigatória."),
	name: z.string().min(1, "O nome é obrigatório."),
	marketName: z.string().min(1, "O nome do mercado é obrigatório."),
	price: z.number().positive("O preço deve ser um número positivo."),
	quantity: z
		.number()
		.int()
		.positive("A quantidade deve ser um número inteiro positivo."),
	unit: z.string().min(1, "A unidade é obrigatória."),
	checked: z.boolean().optional().default(false),
});
