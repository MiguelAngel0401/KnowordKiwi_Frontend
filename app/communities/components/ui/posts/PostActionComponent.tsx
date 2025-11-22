interface PostActionComponentProps {
  icon: React.ReactNode;
  label: string;
}

export default function PostActionComponent({
  icon,
  label,
}: PostActionComponentProps) {
  return (
    <div className="flex-1 bg-bg-gray rounded-xl shadow-lg p-4 flex flex-col items-center gap-2 hover:bg-bg-default transition-colors cursor-pointer">
      {icon}
      <p className="text-sm text-center">{label}</p>
    </div>
  );
}
