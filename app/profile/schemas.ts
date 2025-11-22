import { z } from "zod";

// Esquema para validacion de edicion de usuario
export const profileSchema = z.object({
  realName: z
    .string()
    .min(3, "Tu nombre real debe tener al menos 3 caracteres.")
    .max(50, "Tu nombre real no puede tener más de 50 caracteres."),
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
  username: z
    .string()
    .min(3, "Tu nombre de usuario debe tener al menos 3 caracteres.")
    .max(20, "Tu nombre de usuario no puede tener más de 20 caracteres."),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});
