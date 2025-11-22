import { z } from "zod";

// Este esquema define las reglas de validación para el formulario de inicio de sesión
export const loginSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
  password: z
    .string()
    .min(8, "Tu contraseña debe tener al menos 8 caracteres."),
});

//Este esquema define las reglas de validación para el formulario de registro
export const registerSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
  password: z
    .string()
    .min(8, "Tu contraseña debe tener al menos 8 caracteres."),
  username: z
    .string()
    .min(3, "Tu nombre de usuario debe tener al menos 3 caracteres.")
    .max(20, "Tu nombre de usuario no puede tener más de 20 caracteres."),
  realName: z
    .string()
    .min(3, "Tu nombre real debe tener al menos 3 caracteres.")
    .max(50, "Tu nombre real no puede tener más de 50 caracteres."),
  bio: z
    .string()
    .max(160, "Tu biografía no puede tener más de 160 caracteres.")
    .optional(),
  avatar: z.string().optional(),
});

// Este esquema define las reglas de validación para el formulario de restablecimiento de contraseña
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido. Verifica que esté bien escrito."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
