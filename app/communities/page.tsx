"use client";

import Image from "next/image";
import { MapPin, Users, Shield } from "lucide-react";

const communities = [
  {
    id: "1",
    name: "Frontend Pro",
    description: "Un espacio para dominar React, Tailwind y más.",
    avatar: "/default-avatar.jpeg",
    type: "Pública",
    location: "México",
  },
  {
    id: "2",
    name: "Ciencia y Datos",
    description: "Explora el mundo de la IA, estadística y visualización.",
    avatar: "/default-avatar.jpeg",
    type: "Privada",
    location: "En línea",
  },
  {
    id: "3",
    name: "Diseñadores UX",
    description: "Comunidad creativa para compartir interfaces y experiencias.",
    avatar: "/default-avatar.jpeg",
    type: "Pública",
    location: "Latinoamérica",
  },
];

export default function CommunitiesPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-white">Comunidades destacadas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div key={community.id} className="bg-[#1f2937] text-white rounded-lg shadow p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Image
                src={community.avatar}
                alt={community.name}
                width={64}
                height={64}
                className="rounded-full object-cover w-16 h-16 border border-gray-600"
              />
              <div>
                <h2 className="text-xl font-semibold">{community.name}</h2>
                <p className="text-sm text-gray-300">{community.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-300 pt-2">
              <span className="flex items-center gap-1">
                <MapPin size={16} className="text-blue-500" /> {community.location}
              </span>
              <span className="flex items-center gap-1">
                <Users size={16} className="text-blue-500" /> {community.type}
              </span>
              <span className="flex items-center gap-1">
                <Shield size={16} className="text-blue-500" /> KnowordKiwi
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
