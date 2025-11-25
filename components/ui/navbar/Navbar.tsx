"use client";
import Link from "next/link";
import { NotificationsMenu } from "./NotificationsMenu";
import { ProfileMenu } from "./ProfileMenu";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="p-4 flex flex-col sm:flex-row items-center justify-between z-50 relative border-b border-gray-400">
      <div className="flex w-full sm:w-auto justify-between items-center">
        <h1 className="text-2xl font-bold">KnoWord</h1>
        <button
          className="sm:hidden p-2 rounded-md hover:bg-bg-gray"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:mx-8 order-last sm:order-none md:w-xl">
        <SearchBar />
      </div>

      <div
        className={`${isMobileMenuOpen ? "block w-full mt-4" : "hidden"} sm:flex items-center space-x-4 ml-0 sm:ml-4`}
      >
        {pathname.includes("communities") && (
          <Link
            href={"/communities/create"}
            className="w-full text-center sm:w-auto text-sm bg-primary text-slate-50 font-bold px-4 py-2 rounded-full hover:bg-primary-hover cursor-pointer transition-colors ease-in mb-2 sm:mb-0"
          >
            Crear comunidad
          </Link>
        )}
        <div className="flex justify-center sm:justify-end space-x-4">
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
}
