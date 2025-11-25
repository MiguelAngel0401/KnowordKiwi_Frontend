"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, Tag, Lock, Globe } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";
import DeleteCommunityModal from "@/app/communities/components/modals/DeleteCommunityModal";
import JoinCommunitySuccessModal from "@/app/communities/components/modals/JoinCommunitySuccessModal";
import {
  getCommunityById,
  joinCommunity,
} from "@/services/community/communityServices";
import { CommunityWithOwnership } from "@/types/community";
import LeaveCommunityModal from "../../components/modals/LeaveCommunityModal";
import PostsComponent from "../../components/ui/posts/PostsComponent";

export default function CommunityDetail() {
  const params = useParams();
  const communityId = params.idCommunity as unknown as number;

  const [community, setCommunity] = useState<CommunityWithOwnership | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false); // Para mostrar modal de confirmacion de salir de comunidad
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId) {
      setError("ID de comunidad no proporcionado.");
      setLoading(false);
      return;
    }

    const fetchCommunity = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCommunityById(communityId);
        setCommunity(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "No se pudo cargar la comunidad. Inténtalo más tarde.",
        );
        console.error("Error fetching community:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [communityId]);

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await joinCommunity(communityId);
      setIsJoined(true);
      setCommunity((prev) => (prev ? { ...prev, isMember: true } : null));
    } catch (err) {
      console.error("Error joining community:", err);
      setError("Hubo un error al unirse a la comunidad. Inténtalo más tarde.");
    } finally {
      setIsJoining(false);
    }
  };

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessageScreen error={error} />;
  }

  if (!community) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-text-color">
          No se encontró la comunidad
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Banner de la comunidad */}
      <div className="relative h-48 md:h-64 rounded-t-xl overflow-hidden">
        {community.banner ? (
          <Image
            src={community.banner.trim()}
            width={800}
            height={200}
            alt={`Banner de ${community.name}`}
            className="w-full h-full object-cover z-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.parentElement!.innerHTML = `
                <div class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span class="text-white text-2xl font-bold">${community.name}</span>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {community.name}
            </span>
          </div>
        )}

        {/* Avatar de la comunidad */}
        <div className="absolute bottom-0 left-4 md:left-8 transform translate-y-1/2 z-50">
          {community.avatar ? (
            <Image
              src={community.avatar.trim()}
              width={400}
              height={400}
              alt={community.name}
              className="w-24 h-24 md:w-48 md:h-48 rounded-full border-4 border-white object-cover shadow-lg z-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg z-10">
              <span className="text-2xl md:text-3xl font-bold text-gray-600">
                {community.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-bg-default rounded-b-xl shadow-lg pb-8">
        {/* Información principal de la comunidad */}
        <div className="pt-16 px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-text-color">
                  {community.name}
                </h1>
                {community.isPrivate ? (
                  <Lock className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Globe className="w-5 h-5 text-blue-500" />
                )}
              </div>

              <p className="text-gray-600 max-w-3xl">{community.description}</p>
            </div>
          </div>

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2 mt-6">
            {community.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white bg-tag"
              >
                <Tag className="w-4 h-4 mr-1" />
                {tag.name}
              </span>
            ))}
          </div>

          {community.isOwner && (
            <p className="text-tag italic mt-8 font-bold">
              ¡Eres dueño de esta comunidad! Puedes editar su información o
              incluso eliminarla.
            </p>
          )}

          <div className="flex gap-3 flex-wrap mt-4">
            {/* Botón de Unirse: solo si no es miembro ni dueño */}
            {!community.isOwner && !community.isMember && (
              <button
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary-hover transition-colors"
                onClick={handleJoin}
              >
                {isJoining ? "Uniendo..." : "Unirse"}
              </button>
            )}

            {/* Botón de Salir: si es miembro pero no dueño */}
            {!community.isOwner && community.isMember && (
              <button
                onClick={() => setIsLeaving(true)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Salir
              </button>
            )}

            {/* Acciones del dueño */}
            {community.isOwner && (
              <>
                <Link
                  href={`/communities/community/${community.id}/editar`}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setIsDeleting(true)}
                  className="px-4 py-2 bg-text-error text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </>
            )}

            {/* Botón de compartir siempre visible */}
            <button className="px-4 py-2 border bg-secondary text-white rounded-lg hover:bg-secondary-hover transition-colors">
              Compartir
            </button>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Creada</p>
                <p className="font-medium text-text-color">
                  {formatDate(community.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Miembros</p>
                <p className="font-medium text-text-color">
                  {community.memberCount} miembros
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">Creador</p>
                <p className="font-medium text-text-color">Usuario</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg-gray rounded-xl shadow-lg pb-8">
        {/* Secciones futuras */}
        <div className="mt-12 px-4 md:px-8 py-2">
          <PostsComponent communityId={communityId} />
        </div>
      </div>

      {isDeleting && (
        <DeleteCommunityModal
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          communityName={community.name}
          communityId={community.id}
        />
      )}

      {/* Modal de éxito al unirse */}
      {isJoined && (
        <JoinCommunitySuccessModal
          isOpen={isJoined}
          onClose={() => setIsJoined(false)}
          communityName={community.name}
        />
      )}

      {/* Modal de confirmación de salir de la comunidad */}
      {isLeaving && (
        <LeaveCommunityModal
          isOpen={isLeaving}
          onClose={() => setIsLeaving(false)}
          communityName={community.name}
          communityId={community.id}
        />
      )}
    </div>
  );
}
