"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

export default function SuccessModal({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Aceptar",
}: SuccessModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-bg-default p-6 shadow-xl">
              <DialogTitle className="text-xl font-bold text-emerald-700 flex items-center">
                <svg
                  className="mr-2 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {title}
              </DialogTitle>
              <p className="mt-2 text-gray-700">{message}</p>
              <button
                onClick={handleConfirm}
                className="mt-4 rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
              >
                {confirmText}
              </button>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}