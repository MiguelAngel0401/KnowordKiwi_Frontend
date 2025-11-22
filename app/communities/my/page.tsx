"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";
import { Community } from "@/types/community";
import { getMyCommunities } from "@/services/community/communityServices";

export default function UserCommunitiesList() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const data: Community[] = await getMyCommunities();
        setCommunities(data);
      } catch (err) {
        console.error("Error fetching communities:", err);
        setError(
          "Hubo un error al cargar tus comunidades. Intenta de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessageScreen error={error} />;
  }

  return (
    <div className="min-h-screen text-white p-6 md:p-12 lg:p-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        Mis Comunidades ({communities.length})
      </h2>

      {communities.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            Aún no has creado comunidades
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Crea tu primera comunidad para empezar a colaborar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Link
              key={community.id}
              href={`/communities/community/${community.id}`}
            >
              <div
                key={community.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Banner de la comunidad */}
                <div className="h-32 relative">
                  {community.banner ? (
                    <Image
                      src={community.banner.trim()}
                      fill
                      alt={`Banner de ${community.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500" />
                  )}

                  {/* Avatar de la comunidad */}
                  <div className="absolute -bottom-8 left-4">
                    {community.avatar ? (
                      <Image
                        src={community.avatar.trim()}
                        width={48}
                        height={48}
                        alt={community.name}
                        className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                          {community.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-10 pb-6 px-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                      {community.name}
                    </h3>
                    {community.isPrivate && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Privada
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {community.description}
                  </p>

                  {/* Etiquetas */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {community.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {community.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        +{community.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
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
                      {community.memberCount} miembro
                      {community.memberCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
