import { z } from "zod";

// Este esquema define las reglas de validación para el formulario de creación de comunidad
export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(50, "El título no puede tener más de 50 caracteres."),
  description: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres.")
    .max(500, "La descripción no puede tener más de 500 caracteres."),
  banner: z.string().optional(),
  avatar: z.string().optional(),
});
