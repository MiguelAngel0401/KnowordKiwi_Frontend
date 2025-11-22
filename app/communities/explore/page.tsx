"use client";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { exploreCommunities } from "@/services/community/communityServices";
import { Community } from "@/types/community";

interface TagRelatedToCommunities {
  id: string;
  name: string;
  createdAt: string;
  communities: Community[];
}

export default function ExploreCommunitiesPage() {
  const [tagToCommunitiesData, setTagToCommunitiesData] = useState<
    TagRelatedToCommunities[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await exploreCommunities();
        setTagToCommunitiesData(response);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError(
          "Hubo un error al cargar las comunidades. Intenta de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

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
    <main className="min-h-screen text-white p-6 md:p-12 lg:p-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Explorar Comunidades 🌍
      </h1>
      <div className="space-y-12">
        {tagToCommunitiesData.map((tag, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-semibold capitalize">
                {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
              </h2>
              <Link
                href={`/communities/${tag.name.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-terciary transition-colors duration-200"
              >
                Ver todo →
              </Link>
            </div>
            <div className="flex overflow-x-auto gap-4 p-2 -m-2 custom-scrollbar">
              {tag.communities.map((community, idx) => (
                <Link
                  href={`/communities/community/${community.id}`}
                  key={idx}
                  className="flex-none w-64 h-40 rounded-lg relative overflow-hidden group transition-transform transform hover:scale-105 duration-300"
                >
                  {community.banner ? (
                    <Image
                      src={community.banner}
                      alt={`Banner de la comunidad ${community.name}`}
                      layout="fill"
                      objectFit="cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      priority={idx < 4}
                    />
                  ) : (
                    <div className="bg-[#121212] w-full h-full"></div>
                  )}
                  <div className="absolute inset-0  bg-opacity-40 flex items-end p-4 group-hover:bg-opacity-60 transition-colors duration-200">
                    <span className="text-white text-lg font-medium leading-tight">
                      {community.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 4px;
        }
      `}</style>
    </main>
  );
}
