"use client";

import PostsComponent from "./PostsComponent";

interface BlogPostsComponentProps {
  communityId: number;
}

export default function BlogPostsComponent({
  communityId,
}: BlogPostsComponentProps) {
  // This component now renders all types of posts in the community
  return (
    <PostsComponent communityId={communityId} />
  );
}
