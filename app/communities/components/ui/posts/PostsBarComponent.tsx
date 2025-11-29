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
  const postActions = getPostActions(communityId);
  return (
    <div className="rounded-xl shadow-lg w-full flex gap-2 sm:gap-4 px-2 sm:px-4 py-2 mt-4 items-center overflow-x-auto">
      {postActions.map((action) => (
        <PostActionComponent
          key={action.key}
          label={action.label}
          icon={action.icon}
          href={action.href}
        />
      ))}
    </div>
  );
}
