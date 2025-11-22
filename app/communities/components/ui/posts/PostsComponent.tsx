"use client";

import { useState } from "react";
import PostsBarComponent from "./PostsBarComponent";
import BlogPostsComponent from "./BlogPostsComponent";

interface PostsComponentProps {
  communityId: number;
}

export default function PostsComponent({ communityId }: PostsComponentProps) {
  const [activeTab, setActiveTab] = useState("blog");

  return (
    <div className="mt-6">
      <PostsBarComponent />

      {/* Tabs */}
      <div className="border-b border-gray-700 py-2 mt-4">
        <nav className="flex space-x-8">
          <button
            className={`py-2 px-1 font-medium text-sm ${
              activeTab === "blog"
                ? "text-terciary border-b-2 border-terciary"
                : "text-gray-400 hover:text-gray-300 hover:border-secondary border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("blog")}
          >
            Publicaciones
          </button>
          <button
            className={`py-2 px-1 font-medium text-sm ${
              activeTab === "polls"
                ? "text-terciary border-b-2 border-terciary"
                : "text-gray-400 hover:text-gray-300 hover:border-secondary border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("polls")}
          >
            Encuestas
          </button>
          <button
            className={`py-2 px-1 font-medium text-sm ${
              activeTab === "members"
                ? "text-terciary border-b-2 border-terciary"
                : "text-gray-400 hover:text-gray-300 hover:border-secondary border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("members")}
          >
            Miembros
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="mt-6">
        {activeTab === "blog" && (
          <BlogPostsComponent communityId={communityId} />
        )}
        {activeTab === "polls" && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Funcionalidad de encuestas próximamente.
            </p>
          </div>
        )}
        {activeTab === "members" && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Funcionalidad de miembros próximamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
