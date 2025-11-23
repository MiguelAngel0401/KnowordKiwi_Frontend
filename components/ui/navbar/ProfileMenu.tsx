"use client";
import { Fragment } from "react";
import {
  Menu,
  Transition,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { User } from "lucide-react";
import Link from "next/link";
import privateApiClient from "@/services/client/privateApiClient";

export function ProfileMenu() {
  const logoutFromBackend = async () => {
    try {
      await privateApiClient.post(`/auth/logout`);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  return (
    <Menu as="div" className="relative">
      <MenuButton className="focus:outline-none p-2 rounded-full hover:bg-bg-default transition-colors duration-200">
        <User className="w-6 h-6 text-gray-900" />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-48 bg-bg-gray rounded-md shadow-lg py-1 ring-1 ring-gray-400 ring-opacity-5 focus:outline-none z-50">
          <MenuItem>
            {({ active }) => (
              <Link
                href="/profile/me"
                className={`block px-4 py-4 text-sm ${
                  active ? "bg-bg-default" : "text-gray-900"
                }`}
              >
                Ver perfil
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <Link
                href="/profile/me/edit"
                className={`block px-4 py-4 text-sm ${
                  active ? "bg-bg-default" : "text-gray-900"
                }`}
              >
                Editar perfil
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <Link
                href="/login"
                onClick={() => logoutFromBackend()}
                className={`block w-full text-left px-4 py-4 text-sm ${
                  active ? "bg-red-400 text-red-900" : "text-gray-900"
                }`}
              >
                Cerrar Sesión
              </Link>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
