"use client";
import { deleteCommunity } from "@/services/community/communityServices";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  Transition,
  TransitionChild,
  Input,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
  communityId: string;
}

export default function DeleteCommunityModal({
  isOpen,
  onClose,
  communityName,
  communityId,
}: ErrorModalProps) {
  const router = useRouter();
  const [communityNameInput, setCommunityNameInput] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Para mostrar "eliminando..."
  const [isDeleted, setIsDeleted] = useState(false); // Para mostrar éxito
  const [error, setError] = useState<string | null>(null); // Para mostrar modal de error

  const validateCommunityName = (name: string) => {
    const confirmed = name.trim() === communityName.trim();
    setIsConfirmed(confirmed);
    setCommunityNameInput(name);
  };

  const handleDelete = async () => {
    if (!isConfirmed || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteCommunity(communityId);
      setIsDeleting(false);
      setIsDeleted(true);

      setTimeout(() => {
        onClose();
        router.push("/communities/my");
      }, 3000);
    } catch (error) {
      console.error("Error al eliminar la comunidad:", error);
      setIsDeleting(false);
      setError(
        "Hubo un error al eliminar la comunidad. Por favor, inténtalo de nuevo.",
      );
    }
  };

  const handleCancel = () => {
    setCommunityNameInput("");
    setIsConfirmed(false);
    setIsDeleted(false);
    setIsDeleting(false);
    onClose();
  };

  return (
    <Transition show={isOpen}>
      <Dialog onClose={handleCancel} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />
        </TransitionChild>

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <DialogPanel className="w-full max-w-md rounded-xl bg-bg-gray shadow-2xl border border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 text-center">
                {!isDeleted ? (
                  <>
                    <DialogTitle className="text-xl font-bold text-red-500">
                      ⚠️ ¡Advertencia!
                    </DialogTitle>
                    <DialogTitle className="text-2xl font-bold text-text-color mt-1">
                      ¿Eliminar Comunidad?
                    </DialogTitle>
                  </>
                ) : (
                  <DialogTitle className="text-2xl font-bold text-green-400">
                    ✅ Eliminada con éxito
                  </DialogTitle>
                )}
              </div>

              {/* Body */}
              <div className="px-6 pb-6">
                {!isDeleted ? (
                  <>
                    <Description className="text-gray-600 text-sm leading-relaxed mb-5 text-center">
                      Estás a punto de eliminar permanentemente la comunidad{" "}
                      <span className="font-semibold text-text-color">
                        {communityName}
                      </span>
                      . Esta acción no se puede deshacer. Para confirmar,
                      escribe el nombre:
                    </Description>

                    <div className="relative">
                      <Input
                        type="text"
                        placeholder={`Escribe "${communityName}"`}
                        value={communityNameInput}
                        onChange={(e) => validateCommunityName(e.target.value)}
                        disabled={isDeleting}
                        className={`w-full px-4 py-3 rounded-lg border text-text-color placeholder-gray-500 focus:outline-none transition-all duration-200
                          ${
                            isConfirmed
                              ? "bg-green-900/30 border-green-600 ring-1 ring-green-600"
                              : communityNameInput && !isConfirmed
                                ? "bg-red-900/20 border-red-600"
                                : "bg-green-100 border-gray-600 hover:border-gray-500 focus:border-blue-500"
                          }
                        `}
                      />
                      {isConfirmed && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 text-lg">
                          ✅
                        </div>
                      )}
                    </div>

                    {communityNameInput && !isConfirmed && (
                      <p className="text-red-400 text-xs mt-2 text-center">
                        El nombre no coincide. Revisa mayúsculas y espacios.
                      </p>
                    )}
                  </>
                ) : (
                  <Description className="text-gray-200 text-center text-sm">
                    La comunidad{" "}
                    <span className="font-semibold">{communityName}</span> se
                    eliminó correctamente.
                  </Description>
                )}
                {error && <p className="text-red-400 text-md mt-2">{error}</p>}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6 pt-4 bg-bg-default border-t">
                {!isDeleted ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={!isConfirmed || isDeleting}
                      className={`flex-1 px-4 py-2.5 font-medium rounded-lg transition-all duration-200 text-white
                        ${
                          isConfirmed && !isDeleting
                            ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
                            : "bg-red-900 text-red-400 cursor-not-allowed opacity-60"
                        }
                      `}
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar Comunidad"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Aceptar
                  </button>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
