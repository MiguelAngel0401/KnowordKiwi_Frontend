import { Button } from "@headlessui/react";
import { BookCheck, FileText } from "lucide-react";

export type ViewMode = "blog" | "quiz";

interface ViewModeTogglerProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewModeToggler: React.FC<ViewModeTogglerProps> = ({
  activeView,
  onViewChange,
}) => {
  const getButtonClass = (view: ViewMode) =>
    `px-3 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 ${
      activeView === view
        ? "bg-primary text-white"
        : "hover:bg-secondary-hover text-white"
    }`;

  return (
    <div className="bg-secondary rounded-md flex p-1">
      <Button
        className={getButtonClass("quiz")}
        onClick={() => onViewChange("quiz")}
      >
        <BookCheck size={18} />
        <span>Quiz</span>
      </Button>
      <Button
        className={getButtonClass("blog")}
        onClick={() => onViewChange("blog")}
      >
        <FileText size={18} />
        <span>Blog</span>
      </Button>
    </div>
  );
};

export default ViewModeToggler;
