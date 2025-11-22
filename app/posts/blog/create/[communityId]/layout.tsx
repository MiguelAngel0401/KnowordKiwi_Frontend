import BlogLayout from "../../components/blog/BlogLayout";

export default function CreateBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogLayout>{children}</BlogLayout>;
}
