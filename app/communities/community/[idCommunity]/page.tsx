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
import UserGamificationBar from "@/app/communities/components/gamification/UserGamificationBar";

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
    <div className="max-w-100 md:max-w-4xl lg:max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Banner de la comunidad */}
      <div className="p-1 shadow-lg rounded-2xl bg-white/50">
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
          {community.banner ? (
            <>
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
              <div className="absolute inset-0 bg-warm-gray-800/20"></div>
            </>
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

              <p className="text-gray-600 max-w-3xl my-2">
                {community.description}
              </p>
            </div>
          </div>

          {/* Etiquetas con estilo washi tape */}
          <div className="flex flex-wrap gap-2 mb-6">
            {community.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-stone-700 bg-transparent border border-opacity-30 rounded-sm shadow-sm"
                style={{
                  backgroundColor: `hsl(${(tag.id * 37) % 360}, 50%, 95%)`,
                  borderColor: `hsl(${(tag.id * 37) % 360}, 40%, 70%)`,
                }}
              >
                <Tag className="w-4 h-4 mr-1" />
                {tag.name}
              </span>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap mb-6">
            {/* Botón de Unirse: solo si no es miembro ni dueño */}
            {!community.isOwner && !community.isMember && (
              <button
                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-all border border-amber-200"
                onClick={handleJoin}
              >
                {isJoining ? "Uniendo..." : "Unirse"}
              </button>
            )}

            {/* Botón de Salir: si es miembro pero no dueño */}
            {!community.isOwner && community.isMember && (
              <button
                onClick={() => setIsLeaving(true)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-all border border-stone-200"
              >
                Salir
              </button>
            )}

            {/* Acciones del dueño */}
            {community.isOwner && (
              <>
                <div className="relative group">
                  {/* Botón de configuración con menú desplegable */}
                  <button className="px-4 py-2 bg-lavender-100 text-lavender-800 rounded-lg hover:bg-lavender-200 transition-all border border-lavender-200 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 mr-1"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33h-.09a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82V15a1.65 1.65 0 0 0-1.51-1H3z"></path>
                    </svg>
                    Config.
                  </button>

                  {/* Menú desplegable */}
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-stone-200 hidden group-hover:block">
                    <Link
                      href={`/communities/community/${community.id}/editar`}
                      className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      Editar Comunidad
                    </Link>
                    <button
                      onClick={() => setIsDeleting(true)}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Eliminar Comunidad
                    </button>
                  </div>
                </div>

                {/* Botón de compartir con estilo "ghost" */}
                <button className="px-4 py-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 transition-all">
                  Compartir
                </button>
              </>
            )}

            {/* Botón de compartir para no dueños */}
            {!community.isOwner && !community.isMember && (
              <button className="px-4 py-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 transition-all">
                Compartir
              </button>
            )}
          </div>

          {/* Gamification Bar - Only show if user is a member of the community */}
          {community.isMember && (
            <div className="mt-6">
              <UserGamificationBar
                currentRank="Aprendiz"
                currentXp={1250}
                nextRankXp={2000}
                nextRankName="Experto"
              />
            </div>
          )}

          {/* Información adicional con estilo bullet journal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-300 border-dashed">
            <div className="flex items-center bg-stone-50 p-4 rounded-xl">
              <Calendar className="w-6 h-6 text-stone-600 mr-3" />
              <div>
                <p className="text-sm text-stone-500">Creada</p>
                <p className="font-medium text-stone-800">
                  {formatDate(community.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-stone-50 p-4 rounded-xl">
              <Users className="w-6 h-6 text-stone-600 mr-3" />
              <div>
                <p className="text-sm text-stone-500">Miembros</p>
                <p className="font-medium text-stone-800">
                  {community.memberCount} miembros
                </p>
              </div>
            </div>

            <div className="flex items-center bg-stone-50 p-4 rounded-xl">
              <div className="bg-gradient-to-br from-stone-200 to-stone-300 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="ml-3">
                <p className="text-sm text-stone-500">Creador</p>
                <p className="font-medium text-stone-800">Usuario</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-stone-100 to-amber-50 rounded-2xl shadow-lg mt-6 pb-8 border border-stone-200">
        <div className="mt-8 px-4 md:px-8 py-2">
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
