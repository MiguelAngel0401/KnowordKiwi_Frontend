import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Provee acceso a el estado de autenticacion
export const useAuth = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users to login page
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated };
};

// Protege rutas redirigiendo a usuarios no autenticados
export const useRequireAuth = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users to login page
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
};

// Redirige a usuarios autenticados fuera de rutas para autenticacion
export const useRedirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to profile
    if (isAuthenticated) {
      router.push("/profile/me");
    }
  }, [isAuthenticated, router]);
};
