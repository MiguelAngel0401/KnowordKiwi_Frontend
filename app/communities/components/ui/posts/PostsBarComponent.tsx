import PostActionComponent from "./PostActionComponent";
import {
  Image,
  PanelsTopLeft,
  MessageCircleQuestion,
  FileText,
  Workflow,
  ListChecks,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import CozyUploadPost from "@/app/communities/components/ui/image-post/CozyUploadPost";

const getPostActions = (communityId: number) => [
  {
    label: "Blog",
    icon: <PanelsTopLeft />,
    key: "blog",
    href: `/posts/blog/create/${communityId}`,
  },
  // eslint-disable-next-line jsx-a11y/alt-text
  { label: "Imagen", icon: <Image />, key: "image", href: "#" }, // Actualizar con la ruta correcta
  { label: "Diagrama", icon: <Workflow />, key: "diagram", href: "#" }, // Actualizar con la ruta correcta
  {
    label: "Pregunta",
    icon: <MessageCircleQuestion />,
    key: "question",
    href: "#",
  }, // Actualizar con la ruta correcta
  { label: "Documento", icon: <FileText />, key: "document", href: "#" }, // Actualizar con la ruta correcta
  { label: "Encuesta", icon: <ListChecks />, key: "poll", href: "#" }, // Actualizar con la ruta correcta
  { label: "Evento", icon: <Calendar />, key: "event", href: "#" }, // Actualizar con la ruta correcta
];

interface PostsBarComponentProps {
  communityId: number;
}

export default function PostsBarComponent({
  communityId,
}: PostsBarComponentProps) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const postActions = getPostActions(communityId);

  // Find the image action and handle click differently
  const handleImageActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowImageUpload(true);
  };

  return (
    <>
      <div className="bg-bg-alt rounded-xl shadow-lg w-full flex gap-2 sm:gap-4 px-2 sm:px-4 py-2 mt-4 items-center overflow-x-auto">
        {postActions.map((action) => (
          <PostActionComponent
            key={action.key}
            label={action.label}
            icon={action.icon}
            href={action.key === "image" ? "#" : action.href}
            onClick={
              action.key === "image" ? handleImageActionClick : undefined
            }
          />
        ))}
      </div>

      <CozyUploadPost
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        communityId={communityId}
      />
    </>
  );
}
