import { Input } from "@headlessui/react";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex-grow flex justify-center">
      <div className="relative w-full max-w-xl">
        <Input
          type="text"
          placeholder="Busca cualquier tema en KnoWord"
          className="w-full pl-12 pr-4 py-2 rounded-full bg-bg-default text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-terciary"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
          <Search />
        </div>
      </div>
    </div>
  );
}
