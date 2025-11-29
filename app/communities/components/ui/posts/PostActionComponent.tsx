import Link from "next/link";

interface PostActionComponentProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function PostActionComponent({
  icon,
  label,
  href,
}: PostActionComponentProps) {
  return (
    <Link href={href} className="flex-1">
      <div className="bg-bg-gray rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-secondary hover:text-white transition-colors cursor-pointer h-full w-24">
        {icon}
        <p className="text-sm text-center">{label}</p>
      </div>
    </Link>
  );
}
