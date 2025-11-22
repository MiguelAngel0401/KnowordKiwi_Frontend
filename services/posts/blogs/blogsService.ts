import privateApiClient from "@/services/client/privateApiClient";
import { BlogPost, BlogsByCommunity } from "@/types/posts/blog";

export const createBlogPost = async (data: BlogPost) => {
  try {
    const response = await privateApiClient.post("/posts/blogs/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

export const getBlogPostsByCommunity = async (communityId: number) => {
  try {
    const response = await privateApiClient.get(
      `/posts/blogs/community/${communityId}`,
    );
    return response.data as BlogsByCommunity[];
  } catch (error) {
    console.error("Error getting blog posts by community:", error);
    throw error;
  }
};

export const getBlogPostById = async (id: number) => {
  try {
    const response = await privateApiClient.get(`/posts/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting blog post by id:", error);
    throw error;
  }
};

export const getBlogPostsByUser = async () => {
  try {
    const response = await privateApiClient.get(`/posts/blogs/author/all`);
    return response.data;
  } catch (error) {
    console.error("Error getting blog posts by user:", error);
    throw error;
  }
};

export const updateBlogPost = async (id: number, data: Partial<BlogPost>) => {
  try {
    const response = await privateApiClient.patch(`/posts/blogs/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};

export const deleteBlogPost = async (id: number) => {
  try {
    const response = await privateApiClient.delete(`/posts/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};
