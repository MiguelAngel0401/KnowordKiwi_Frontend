import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import React from "react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function CommunityErrorModal({
  isOpen,
  onClose,
  message,
}: ErrorModalProps) {
  const router = useRouter();

  const handleGoToCommunities = () => {
    router.push("/communities/explore");
    onClose(); // Cierra el modal al navegar
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Fondo oscuro (backdrop) */}
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </TransitionChild>

        {/* Contenedor del modal centrado */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-auto text-white">
              <div className="flex flex-col items-center">
                <DialogTitle className="text-2xl font-bold text-red-500 mb-4 text-center">
                  Ha ocurrido un error
                </DialogTitle>

                <Description className="text-md text-gray-200 mb-6 text-center">
                  {message || "Algo salió mal. Por favor, inténtalo de nuevo."}
                </Description>
                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-primary rounded hover:bg-primary-hover text-white"
                  >
                    Reintentar
                  </button>
                  <button
                    onClick={handleGoToCommunities}
                    className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-hover"
                  >
                    Explorar comunidades
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
