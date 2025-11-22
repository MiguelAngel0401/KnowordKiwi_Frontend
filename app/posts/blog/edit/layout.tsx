import BlogLayout from "../components/blog/BlogLayout";

export default function EditBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogLayout>{children}</BlogLayout>;
}
