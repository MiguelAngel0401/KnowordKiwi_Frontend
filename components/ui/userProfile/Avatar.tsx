import Image from "next/image";

type AvatarProps = {
  src?: string;
  size: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
};

export function Avatar({ src, size = "md", editable = false }: AvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10", // Tailwind's default w-10/h-10 is 40px
    md: "w-20 h-20", // Tailwind's default w-20/h-20 is 80px
    lg: "w-32 h-32", // Tailwind's default w-32/h-32 is 128px (close to 120, adjust if needed)
    xl: "w-52 h-52", // Tailwind's default w-52/h-52 is 208px (close to 200, adjust if needed)
  };

  // For Image component, still use pixel values
  const pixelSizes = {
    sm: 40,
    md: 80,
    lg: 120,
    xl: 200,
  };

  return (
    <div className={`rounded-md overflow-hidden ${sizeClasses[size]}`}>
      <Image
        src={src || "/default-avatar.jpeg"}
        width={pixelSizes[size]}
        height={pixelSizes[size]}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
      {editable && "Editar"}
    </div>
  );
}
