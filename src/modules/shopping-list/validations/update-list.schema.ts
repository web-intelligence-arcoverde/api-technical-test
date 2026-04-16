import { z } from "zod";

const itemSchema = z.object({
	id: z.string().optional(),
	category: z.string().min(1, "A categoria é obrigatória."),
	name: z.string().min(1, "O nome é obrigatório."),
	marketName: z.string().min(1, "O nome do mercado é obrigatório."),
	price: z.number().positive("O preço deve ser um número positivo."),
	quantity: z.number().positive("A quantidade deve ser positiva."),
	unit: z.string().min(1, "A unidade é obrigatória."),
	checked: z.boolean().optional().default(false),
});

export const updateListSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	category: z.string().optional(),
	variant: z.enum(["primary", "secondary", "tertiary"]).optional(),
	totalItems: z.number().optional(),
	securedItems: z.number().optional(),
	items: z.array(itemSchema).optional(),
	shared: z.boolean().optional(),
});
