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

const postActions = [
  { label: "Blog", icon: <PanelsTopLeft />, key: "blog" },
  // eslint-disable-next-line jsx-a11y/alt-text
  { label: "Imagen", icon: <Image />, key: "image" },
  { label: "Diagrama", icon: <Workflow />, key: "diagram" },
  { label: "Pregunta", icon: <MessageCircleQuestion />, key: "question" },
  { label: "Documento", icon: <FileText />, key: "document" },
  { label: "Encuesta", icon: <ListChecks />, key: "poll" },
  { label: "Evento", icon: <Calendar />, key: "event" },
];

export default function PostsBarComponent() {
  return (
    <div className="rounded-xl shadow-lg w-full flex gap-4 px-4 py-2 mt-4 items-center">
      {postActions.map((action) => (
        <PostActionComponent
          key={action.key}
          label={action.label}
          icon={action.icon}
        />
      ))}
    </div>
  );
}
