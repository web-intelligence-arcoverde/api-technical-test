import { z } from "zod";

export const listProductValidation = z.object({
	listId: z.string().min(1, "O ID da lista é obrigatório."),
	limit: z.string().regex(/^\d+$/).transform(Number),
	page: z.string().regex(/^\d+$/).transform(Number),
});
