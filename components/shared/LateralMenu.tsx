"use client";
import {
  Home,
  Compass,
  Users,
  Bookmark,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Menu, MenuItem } from "@headlessui/react";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";

const navigation = [
  { name: "Inicio", href: "#", icon: Home },
  { name: "Explorar", href: "#", icon: Compass },
  {
    name: "Comunidades",
    href: "/communities/explore",
    icon: Users,
    submenu: true,
  },
  { name: "Cursos", href: "#", icon: Bookmark },
  { name: "Configuración", href: "#", icon: Settings },
];

const communitySubmenu = [
  { name: "Explorar Comunidades", href: "/communities/explore" },
  { name: "Comunidades a las que pertenezco", href: "/communities/member" },
  { name: "Mis Comunidades", href: "/communities/my" },
];

export default function LateralMenu() {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  return (
    <div className="md:p-4 md:relative fixed bottom-0 left-0 right-0 bg-bg-default md:bg-transparent z-20">
      <Menu as="nav">
        <ul className="flex flex-row md:flex-col justify-around md:justify-start gap-2 p-2 md:p-0">
          {navigation.map((item) => (
            <MenuItem
              as="li"
              key={item.name}
              className="flex-1 md:flex-initial"
            >
              {({ active }) => (
                <li>
                  {item.submenu ? (
                    <div className="w-full">
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={clsx(
                          "w-full inline-flex flex-col md:flex-row items-center justify-center md:justify-between gap-1 md:gap-2 rounded-md py-2 px-2 md:px-4 transition-colors duration-200 text-xs md:text-base",
                          active
                            ? "bg-secondary text-white"
                            : "text-gray-900 hover:bg-primary-hover hover:text-white",
                        )}
                      >
                        <div
                          className={clsx("flex items-center gap-2", {
                            "flex-col md:flex-row": item.submenu,
                          })}
                        >
                          <item.icon size={20} />
                          {item.name}
                        </div>
                        <ChevronRight
                          size={16}
                          className={clsx(
                            "transition-transform duration-200",
                            openSubmenu === item.name ? "rotate-90" : "",
                          )}
                        />
                      </button>

                      {/* Submenú */}
                      {openSubmenu === item.name && (
                        <div className="ml-6 mt-2 flex gap-1 md:flex-col">
                          {communitySubmenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="inline-flex items-center gap-2 rounded-md py-2 px-4 text-sm text-gray-900 hover:bg-primary-hover hover:text-white transition-colors duration-200"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        "inline-flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 rounded-md py-2 px-2 md:px-4 transition-colors duration-200 w-full text-xs md:text-base",
                        active
                          ? "bg-secondary text-white"
                          : "text-gray-900 hover:bg-primary-hover hover:text-white",
                      )}
                    >
                      <item.icon size={20} />
                      {item.name}
                    </Link>
                  )}
                </li>
              )}
            </MenuItem>
          ))}
        </ul>
      </Menu>
    </div>
  );
}
