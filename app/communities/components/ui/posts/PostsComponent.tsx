"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Heart, User } from "lucide-react";
import {
  getAllPostsByCommunity,
  PostByCommunity,
} from "@/services/posts/postsService";
import Link from "next/link";

interface PostsComponentProps {
  communityId: number;
}

export default function PostsComponent({ communityId }: PostsComponentProps) {
  const [posts, setPosts] = useState<PostByCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate time difference in days, similar to "4d ago"
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - past.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 1 ? `Hace ${diffDays} días` : `Hace 1 día`;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllPostsByCommunity(communityId);
        // Add placeholder reaction/comment counts for a more realistic look like the image
        const postsWithPlaceholders = data.map((post) => ({
          ...post,
          placeholderReactions: 438, // Simulating the '438' from the image
          placeholderComments: 17, // Simulating the '17' from the image
        }));
        setPosts(postsWithPlaceholders as PostByCommunity[]);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("No se pudieron cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchPosts();
    }
  }, [communityId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-color">
          No hay publicaciones en esta comunidad aún.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 mt-6 mb-24">
      {posts.map((post) => {
        // Check what type of post it is and render appropriately
        if (post.blogContent) {
          return (
            <BlogPostCard
              key={post.id}
              post={post as PostByCommunity & { blogContent: any }}
              getTimeAgo={getTimeAgo}
            />
          );
        } else if (post.imageContent) {
          return (
            <ImagePostCard
              key={post.id}
              post={post as PostByCommunity & { imageContent: any }}
              getTimeAgo={getTimeAgo}
            />
          );
        } else if (post.excalidrawContent) {
          return (
            <DiagramPostCard
              key={post.id}
              post={post as PostByCommunity & { excalidrawContent: any }}
              getTimeAgo={getTimeAgo}
            />
          );
        } else {
          // Default card for other post types
          return (
            <DefaultPostCard
              key={post.id}
              post={post}
              getTimeAgo={getTimeAgo}
            />
          );
        }
      })}
    </div>
  );
}

// Blog Post Card Component
interface BlogPostCardProps {
  post: PostByCommunity & { blogContent: any };
  getTimeAgo: (dateString: string) => string;
}

function BlogPostCard({ post, getTimeAgo }: BlogPostCardProps) {
  return (
    <Link href={`/posts/blog/${post.id}`}>
      <div className="rounded-lg p-4 md:p-6 hover:bg-bg-default transition-colors cursor-pointer">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
            <User className="text-white w-4 h-4" />
          </div>
          <h3 className="font-semibold text-text-color text-sm">
            {post.author.user.username}
          </h3>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-text-color mb-2 leading-tight">
          {post.title}
        </h2>

        {/* Subtitle/Description - Matching the image's second line */}
        <p className="text-base md:text-lg text-gray-700 mb-4">
          {post.blogContent?.subtitle}
        </p>

        {/* Metadata/Stats Section - Mimicking the "4d ago 438 17" row */}
        <div className="flex items-center text-gray-500 text-sm mt-4">
          <span className="mr-4">{getTimeAgo(post.createdAt)}</span>

          {/* Reactions (438) - Using a placeholder until actual data is available */}
          <div className="flex items-center mr-4">
            <Heart size={16} className="mr-1" />
            <span className="font-medium">
              {(post as any).placeholderReactions || 0}
            </span>
          </div>

          {/* Comments (17) - Using a placeholder until actual data is available */}
          <div className="flex items-center">
            <MessageCircle size={16} className="mr-1" />
            <span className="font-medium">
              {(post as any).placeholderComments || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Image Post Card Component
interface ImagePostCardProps {
  post: PostByCommunity & { imageContent: any };
  getTimeAgo: (dateString: string) => string;
}

function ImagePostCard({ post, getTimeAgo }: ImagePostCardProps) {
  return (
    <Link href={`/posts/image/${post.id}`}>
      <div className="rounded-lg p-4 md:p-6 hover:bg-bg-default transition-colors cursor-pointer">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
            <User className="text-white w-4 h-4" />
          </div>
          <h3 className="font-semibold text-text-color text-sm">
            {post.author.user.username}
          </h3>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-text-color mb-2 leading-tight">
          {post.title}
        </h2>

        {/* Image preview */}
        <div className="mb-4 overflow-hidden">
          <img
            src={post.imageContent?.imageUrl}
            alt={post.title}
            className="max-w-full h-auto max-h-96 object-cover rounded-lg border-4 border-white shadow-xl rotate-1"
          />
        </div>

        {/* Description if available */}
        {post.imageContent?.description && (
          <p className="text-base md:text-lg text-gray-700 mb-4">
            {post.imageContent.description}
          </p>
        )}

        {/* Image tags */}
        {post.imageContent?.imageTags &&
          post.imageContent.imageTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.imageContent.imageTags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

        {/* Metadata/Stats Section - Mimicking the "4d ago 438 17" row */}
        <div className="flex items-center text-gray-500 text-sm mt-4">
          <span className="mr-4">{getTimeAgo(post.createdAt)}</span>

          {/* Reactions (438) - Using a placeholder until actual data is available */}
          <div className="flex items-center mr-4">
            <Heart size={16} className="mr-1" />
            <span className="font-medium">
              {(post as any).placeholderReactions || 0}
            </span>
          </div>

          {/* Comments (17) - Using a placeholder until actual data is available */}
          <div className="flex items-center">
            <MessageCircle size={16} className="mr-1" />
            <span className="font-medium">
              {(post as any).placeholderComments || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Default Post Card Component for other post types
interface DefaultPostCardProps {
  post: PostByCommunity;
  getTimeAgo: (dateString: string) => string;
}

function DefaultPostCard({ post, getTimeAgo }: DefaultPostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="rounded-lg p-4 md:p-6 hover:bg-bg-default transition-colors cursor-pointer">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
            <User className="text-white w-4 h-4" />
          </div>
          <h3 className="font-semibold text-text-color text-sm">
            {post.author.user.username}
          </h3>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-text-color mb-2 leading-tight">
          {post.title}
        </h2>

        {/* Metadata/Stats Section - Mimicking the "4d ago 438 17" row */}
        <div className="flex items-center text-gray-500 text-sm mt-4">
          <span className="mr-4">{getTimeAgo(post.createdAt)}</span>

          {/* Reactions (438) - Using a placeholder until actual data is available */}
          <div className="flex items-center mr-4">
            <Heart size={16} className="mr-1" />
            <span className="font-medium">
              {(post as any).placeholderReactions || 0}
            </span>
          </div>

          {/* Comments (17) - Using a placeholder until actual data is available */}
          <div className="flex items-center">
            <MessageCircle size={16} className="mr-1" />
            <span className="font-medium">
              {(post as any).placeholderComments || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}



// Diagram Post Card Component
interface DiagramPostCardProps {
  post: PostByCommunity & { excalidrawContent: any };
  getTimeAgo: (dateString: string) => string;
}

function DiagramPostCard({ post, getTimeAgo }: DiagramPostCardProps) {
  // Use the first few elements as a preview, or show a thumbnail if available
  const elementCount = post.excalidrawContent?.diagramData?.elements?.length || 0;
  const diagramTitle = post.title;
  
  return (
    <Link href={`/posts/diagram/${post.id}`}>
      <div className="rounded-lg p-4 md:p-6 hover:bg-bg-default transition-colors cursor-pointer">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
            <User className="text-white w-4 h-4" />
          </div>
          <h3 className="font-semibold text-text-color text-sm">
            {post.author.user.username}
          </h3>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-text-color mb-2 leading-tight">
          {diagramTitle}
        </h2>

        {/* Diagram preview */}
        <div className="mb-4 p-4 bg-stone-50 rounded-lg border border-stone-200 min-h-[120px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block p-2 bg-amber-100 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Diagrama de Excalidraw</p>
            <p className="text-gray-500 text-xs mt-1">{elementCount} elementos</p>
          </div>
        </div>

        {/* Metadata/Stats Section */}
        <div className="flex items-center text-gray-500 text-sm mt-4">
          <span className="mr-4">{getTimeAgo(post.createdAt)}</span>

          {/* Reactions (438) - Using a placeholder until actual data is available */}
          <div className="flex items-center mr-4">
            <Heart size={16} className="mr-1" />
            <span className="font-medium">
              {(post as any).placeholderReactions || 0}
            </span>
          </div>

          {/* Comments (17) - Using a placeholder until actual data is available */}
          <div className="flex items-center">
            <MessageCircle size={16} className="mr-1" />
            <span className="font-medium">
              {(post as any).placeholderComments || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
