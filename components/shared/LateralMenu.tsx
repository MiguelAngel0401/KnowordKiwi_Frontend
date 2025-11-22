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
    <div className="p-4">
      <Menu as="nav">
        <ul className="flex flex-col gap-2">
          {navigation.map((item) => (
            <MenuItem key={item.name}>
              {({ active }) => (
                <li>
                  {item.submenu ? (
                    <div className="w-full">
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={clsx(
                          "w-full inline-flex items-center justify-between gap-2 rounded-md py-2 px-4 transition-colors duration-200",
                          active
                            ? "bg-secondary text-white"
                            : "text-white hover:bg-primary-hover",
                        )}
                      >
                        <div className="flex items-center gap-2">
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
                        <div className="ml-6 mt-2 flex flex-col gap-1">
                          {communitySubmenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="inline-flex items-center gap-2 rounded-md py-2 px-4 text-sm text-gray-300 hover:bg-primary-hover hover:text-white transition-colors duration-200"
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
                        "inline-flex items-center gap-2 rounded-md py-2 px-4 transition-colors duration-200 w-full",
                        active
                          ? "bg-secondary text-white"
                          : "text-white hover:bg-primary-hover",
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
