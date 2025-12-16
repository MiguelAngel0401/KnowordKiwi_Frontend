"use client";
import Image from "next/image";
import { Community } from "@/types/community/community";
import { getCommunitiesByTag } from "@/services/community/communityServices";
import { useEffect, useState } from "react";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TagPage() {
  const params = useParams();
  const tagForApi = params.tag as string;
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorFetchingCommunities, setErrorFetchingCommunities] = useState<
    string | null
  >(null);

  useEffect(() => {
    setLoading(true);
    const fetchCommunities = async () => {
      try {
        const data = await getCommunitiesByTag(tagForApi);
        setCommunities(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching communities", error);
        setErrorFetchingCommunities("No se pudo cargar las comunidades");
      }
    };
    fetchCommunities();
  }, [tagForApi]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terciary"></div>
      </div>
    );
  }

  if (errorFetchingCommunities) {
    return <ErrorMessageScreen error={errorFetchingCommunities} />;
  }

  return (
    <main className="min-h-screen text-text-color p-6 mb-24">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        Comunidades de {tagForApi}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
        {communities.map((community) => (
          <Link
            href={`/communities/community/${community.id}`}
            key={community.id}
            className="bg-bg-gray rounded-xl overflow-hidden hover:bg-bg-default hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
          >
            {/* Banner de la comunidad */}
            <div className="h-24 relative">
              {community.banner ? (
                <Image
                  src={community.banner}
                  fill
                  alt={`Banner de ${community.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
              )}

              {/* Avatar de la comunidad */}
              <div className="absolute -bottom-8 left-4">
                {community.avatar ? (
                  <Image
                    src={community.avatar}
                    alt={community.name}
                    className="w-16 h-16 rounded-full border-4 border-bg-gray object-cover"
                    width={64}
                    height={64}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-4 border-bg-gray bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {community.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Indicador de privacidad */}
              {community.isPrivate && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                  Privada
                </div>
              )}
            </div>

            {/* Contenido de la tarjeta */}
            <div className="pt-8 pb-4 px-4">
              <h2 className="text-lg font-bold text-text-color mb-1 truncate">
                {community.name}
              </h2>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {community.description}
              </p>

              {/* Etiquetas */}
              <div className="flex flex-wrap gap-1 mb-3">
                {community.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-tag text-white font-bold"
                  >
                    {tag.name}
                  </span>
                ))}
                {community.tags.length > 2 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-white font-bold">
                    +{community.tags.length - 2}
                  </span>
                )}
              </div>

              {/* Información adicional */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Creada: {formatDate(community.createdAt)}</span>
                <span className="inline-flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                  {community.memberCount}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
