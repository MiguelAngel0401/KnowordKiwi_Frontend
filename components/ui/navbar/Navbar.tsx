"use client";
import Link from "next/link";
import { NotificationsMenu } from "./NotificationsMenu";
import { ProfileMenu } from "./ProfileMenu";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="p-4 flex items-center justify-between z-50 relative border-b border-gray-400">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-8">KnoWord</h1>
      </div>
      <SearchBar />
      <div className="flex items-center space-x-4 ml-8 mr-4">
        {pathname.includes("communities") && (
          <Link
            href={"/communities/create"}
            className="text-sm bg-primary text-gray-900 px-4 py-2 rounded hover:bg-primary-hover cursor-pointer transition-colors ease-in"
          >
            Crear comunidad
          </Link>
        )}
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </nav>
  );
}
