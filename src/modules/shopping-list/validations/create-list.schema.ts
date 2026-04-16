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

export const createListSchema = z.object({
	title: z.string().min(1, "O título é obrigatório."),
	description: z.string().optional().default(""),
	category: z.string().min(1, "A categoria é obrigatória."),
	variant: z.enum(["primary", "secondary", "tertiary"]).default("primary"),
	totalItems: z.number().optional().default(0),
	securedItems: z.number().optional().default(0),
	items: z.array(itemSchema).optional().default([]),
	shared: z.boolean().optional().default(false),
});
