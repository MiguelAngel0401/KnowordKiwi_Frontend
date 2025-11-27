"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";

interface InfoModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function InfoModal({
  isOpen,
  message,
  onClose,
}: InfoModalProps) {
  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-bg-gray p-6 shadow-xl">
              <DialogTitle className="text-xl font-bold">Aviso</DialogTitle>
              <p className="mt-2 text-gray-700">{message}</p>
              <button
                onClick={onClose}
                className="mt-4 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
              >
                Entendido
              </button>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
