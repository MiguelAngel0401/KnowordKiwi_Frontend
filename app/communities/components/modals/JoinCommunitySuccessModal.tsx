// components/modals/JoinSuccessModal.tsx
import { useEffect } from "react";

interface JoinSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName: string;
}

export default function JoinSuccessModal({
  isOpen,
  onClose,
  communityName,
}: JoinSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Cierra automáticamente después de 3 segundos

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro semitransparente */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600 dark:text-green-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          ¡Éxito!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Ahora eres miembro de{" "}
          <span className="font-semibold">{communityName}</span>.
        </p>
      </div>
    </div>
  );
}
