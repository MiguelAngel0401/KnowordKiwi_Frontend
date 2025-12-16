import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useRouter } from "next/navigation";

interface CommunitySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  communityId?: string | number;
}

export default function CommunitySuccessModal({
  isOpen,
  onClose,
  message,
  communityId,
}: CommunitySuccessModalProps) {
  const router = useRouter();

  const handleGoToCommunity = () => {
    if (communityId) {
      router.push(`/communities/community/${communityId}`);
    }
    onClose();
  };

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
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
            <DialogPanel className="w-full max-w-md rounded-xl bg-gray-900 shadow-2xl border border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 text-center">
                <DialogTitle className="text-2xl font-bold text-green-400">
                  ✅ Comunidad Creada
                </DialogTitle>
              </div>

              {/* Body */}
              <div className="px-6 pb-4">
                <Description className="text-gray-300 text-sm leading-relaxed text-center">
                  {message || "Tu comunidad ha sido creada exitosamente."}
                </Description>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6 pt-4 bg-gray-800/50 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors duration-200"
                >
                  OK, lo he entendido
                </button>
                <button
                  type="button"
                  onClick={handleGoToCommunity}
                  className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary-hover text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Muestrame mi comunidad
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
