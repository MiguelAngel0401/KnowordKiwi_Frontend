"use client";

import { Avatar } from "@/components/ui/userProfile/Avatar";
import { useEffect, useState } from "react";
import Posts from "./Posts";
import Communities from "./Communities";
import Followers from "./Followers";
import { getMe } from "@/services/users/userServices";
import { User } from "@/types/users/user";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";
import { Users, BookUser } from "lucide-react";

type ActiveTab = "posts" | "communities" | "followers";

export function Banner() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("posts");
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getMe();
        setUserData(data.user);
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("No pudimos cargar tu perfil. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessageScreen error={error} />;
  }

  if (!userData) {
    return null;
  }

  const getButtonClasses = (tab: ActiveTab) => {
    const baseClasses = "px-4 py-2 transition-colors duration-300 outline-none";
    // Usaremos colores más oscuros para el texto sobre el fondo claro de la app
    if (activeTab === tab) {
      return `${baseClasses} border-b-2 border-primary text-gray-900 font-semibold`;
    }
    return `${baseClasses} text-gray-500 hover:text-gray-800`;
  };

  return (
    <div className="w-full flex flex-col items-center px-4">
      <section className="bg-bg-default w-full max-w-5xl mx-auto mt-8 p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg flex flex-col gap-y-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative flex-shrink-0">
            {/* Marco estilo "Polaroid" */}
            <div className="bg-white p-2 rounded-md shadow-md transform -rotate-3">
              <Avatar src={userData.avatar || ""} size="lg" />
            </div>
            {/* Decoración: "Washi Tape" simulado */}
            <div className="absolute -top-2 -right-4 w-16 h-6 bg-teal-200 bg-opacity-50 transform rotate-12 pointer-events-none"></div>
          </div>

          {/* 3 & 4. Tipografía e Información del usuario */}
          <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left gap-4">
            {/* Nombre de usuario y real */}
            <div className="text-stone-800">
              <h1 className="font-lora text-3xl sm:text-4xl font-bold">
                {userData.username}
              </h1>
              <p className="font-sans text-lg text-stone-600">
                {userData.realName}
              </p>
            </div>

            {/* Biografía */}
            <p className="font-indie-flower text-base text-stone-500 leading-relaxed max-w-xl">
              {userData.bio || "Este usuario aún no ha añadido una biografía."}
            </p>

            {/* 4. Estadísticos (Seguidores): Integración Amigable */}
            <div className="flex flex-wrap gap-4 text-sm mt-2">
              <div className="flex items-center gap-2 bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
                <Users size={16} />
                <span className="font-medium">1 Seguidor</span>
              </div>
              <div className="flex items-center gap-2 bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
                <BookUser size={16} />
                <span className="font-medium">1 Siguiendo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pestañas de Navegación */}
      <div className="flex w-full max-w-5xl mx-auto justify-start border-b border-gray-200 mt-12 gap-x-4 sm:gap-x-8">
        <button
          className={getButtonClasses("posts")}
          onClick={() => setActiveTab("posts")}
        >
          Publicaciones
        </button>
        <button
          className={getButtonClasses("communities")}
          onClick={() => setActiveTab("communities")}
        >
          Comunidades
        </button>
        <button
          className={getButtonClasses("followers")}
          onClick={() => setActiveTab("followers")}
        >
          Seguidores
        </button>
      </div>

      {/* Área de contenido dinámico */}
      <div className="w-full max-w-5xl mx-auto mt-8">
        {activeTab === "posts" && <Posts />}
        {activeTab === "communities" && <Communities />}
        {activeTab === "followers" && <Followers />}
      </div>
    </div>
  );
}
