"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Heart, User } from "lucide-react";
import { getBlogPostsByCommunity } from "@/services/posts/blogs/blogsService";
import { BlogsByCommunity } from "@/types/posts/blog";
import Link from "next/link";

interface BlogPostsComponentProps {
  communityId: number;
}

export default function BlogPostsComponent({
  communityId,
}: BlogPostsComponentProps) {
  const [blogPosts, setBlogPosts] = useState<BlogsByCommunity[]>([]);
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
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogPostsByCommunity(communityId);
        // Add placeholder reaction/comment counts for a more realistic look like the image
        const postsWithPlaceholders = data.map((post) => ({
          ...post,
          // Example of adding placeholder data if not present in your API response
          // Your 'BlogsByCommunity' type may need to be updated to include these actual fields
          placeholderReactions: 438, // Simulating the '438' from the image
          placeholderComments: 17, // Simulating the '17' from the image
        }));
        setBlogPosts(postsWithPlaceholders as BlogsByCommunity[]);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("No se pudieron cargar las publicaciones del blog.");
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchBlogPosts();
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

  if (blogPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No hay publicaciones de blog en esta comunidad aún.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {blogPosts.map((post) => (
        <Link
          // Implementar la navegación al detalle del blog
          href={`/posts/blog/${post.id}`}
          key={post.id}
        >
          <div
            key={post.id}
            className="rounded-lg p-6 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                <User className="text-gray-300 w-4 h-4" />{" "}
              </div>
              <h3 className="font-semibold text-white text-sm">
                {post.author.user.username}
              </h3>
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
              {post.title}
            </h2>

            {/* Subtitle/Description - Matching the image's second line */}
            <p className="text-lg text-gray-400 mb-4">
              {post.blogContent.subtitle}
            </p>

            {/* Metadata/Stats Section - Mimicking the "4d ago 438 17" row */}
            <div className="flex items-center text-gray-400 text-sm mt-4">
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
      ))}
    </div>
  );
}
