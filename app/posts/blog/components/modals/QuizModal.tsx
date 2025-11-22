import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showConfirmButton?: boolean; // Propiedad para controlar la visibilidad del botón de confirmación
}

export default function QuizModal({
  isOpen,
  onClose,
  title,
  children,
  showConfirmButton = false, // Por defecto, no se muestra
}: ModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-bg-default border border-gray-700 p-6 text-left align-middle shadow-2xl transition-all">
                <div className="flex justify-between items-center">
                  <DialogTitle
                    as="h2"
                    className="text-2xl font-bold leading-6 text-white"
                  >
                    {title}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="mt-2 max-h-[80vh] overflow-y-auto pr-4">
                  {/* El contenido del quiz (los children) se renderiza aquí */}
                  {children}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
