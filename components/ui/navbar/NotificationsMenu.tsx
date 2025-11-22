// components/navbar/NotificationsMenu.tsx
"use client";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { Bell, Trophy, MessageSquare, Users } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import { MessageItem } from "./MessageItem";
import { CommunityUpdateItem } from "./CommunityUpdateItem";

import type { Notification } from "./NotificationItem";

const notifications: Notification[] = [
  {
    id: 1,
    type: "achievement",
    title: "El primer brote desbloqueado.",
    points: "+5 ptos",
    date: "21/05/2025",
    actionText: "RECLAMA LA MEDALLA",
  },
  {
    id: 2,
    type: "rank",
    title: "Conseguiste nuevo rango Aspirante",
    date: "21/05/2025",
  },
  {
    id: 3,
    type: "achievement-knoword",
    title: "Espacio Brainly desbloqueado.",
    points: "+5 ptos",
    date: "12/05/2025",
  },
];

const messages = [
  {
    id: 1,
    sender: "Ana G.",
    message: "¡Hola! ¿Podrías ayudarme con un problema de física?",
    time: "Hace 5 min",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    sender: "Pedro L.",
    message: "Revisa mi última respuesta, creo que te servirá.",
    time: "Ayer",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const communityUpdates = [
  {
    id: 1,
    title: "Nuevo evento: Maratón de Matemáticas",
    date: "20/06/25",
    description: "¡Inscríbete ya y demuestra tus habilidades!",
  },
  {
    id: 2,
    title: "Reglas actualizadas del foro",
    date: "15/06/2025",
    description: "Por favor, revisa los cambios para una mejor convivencia.",
  },
];

export function NotificationsMenu() {
  const [activeTab, setActiveTab] = useState<
    "notifications" | "messages" | "community"
  >("notifications");

  return (
    <Menu as="div" className="relative">
      <MenuButton className="focus:outline-none p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
        <Bell className="w-6 h-6 text-white" />
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
        <MenuItems className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#1f1e28] rounded-md shadow-lg py-1 ring-1 ring-gray-700 focus:outline-none z-50">
          <div className="flex justify-around items-center py-3 border-b border-gray-700">
            <div
              className={`flex flex-col items-center cursor-pointer p-2 rounded-md ${
                activeTab === "notifications"
                  ? "text-terciary bg-gray-800"
                  : "text-gray-500 hover:text-secondary hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <Trophy className="w-6 h-6" />
            </div>
            <div
              className={`flex flex-col items-center cursor-pointer p-2 rounded-md ${
                activeTab === "messages"
                  ? "text-terciary bg-gray-800"
                  : "text-gray-500 hover:text-secondary hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare className="w-6 h-6" />
            </div>
            <div
              className={`flex flex-col items-center cursor-pointer p-2 rounded-md ${
                activeTab === "community"
                  ? "text-terciary bg-gray-800"
                  : "text-gray-500 hover:text-secondary hover:bg-gray-800"
              }`}
              onClick={() => setActiveTab("community")}
            >
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div>
            {activeTab === "notifications" && (
              <>
                <div className="px-4 py-4 font-bold text-lg border-b border-gray-700">
                  Notificaciones
                </div>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <MenuItem key={n.id} as="div">
                      {({ active }) => (
                        <NotificationItem notification={n} active={active} />
                      )}
                    </MenuItem>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-500">
                    No tienes notificaciones de logros.
                  </div>
                )}
              </>
            )}
            {activeTab === "messages" && (
              <>
                <div className="px-4 py-4 font-bold text-lg border-b border-gray-700">
                  Mensajes
                </div>
                {messages.length > 0 ? (
                  messages.map((m) => (
                    <MenuItem key={m.id} as="div">
                      {({ active }) => (
                        <MessageItem message={{ ...m, active }} />
                      )}
                    </MenuItem>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-500">
                    No tienes mensajes.
                  </div>
                )}
              </>
            )}
            {activeTab === "community" && (
              <>
                <div className="px-4 py-4 font-bold text-lg border-b border-gray-700">
                  Tus Comunidades
                </div>
                {communityUpdates.length > 0 ? (
                  communityUpdates.map((u) => (
                    <MenuItem key={u.id} as="div">
                      {({ active }) => (
                        <CommunityUpdateItem update={{ ...u, active }} />
                      )}
                    </MenuItem>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-500">
                    No hay actualizaciones de la comunidad.
                  </div>
                )}
              </>
            )}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
