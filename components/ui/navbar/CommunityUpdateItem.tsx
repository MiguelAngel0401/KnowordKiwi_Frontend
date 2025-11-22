"use client";
import { Users } from "lucide-react";

interface CommunityUpdate {
  id: number;
  title: string;
  date: string;
  description: string;
  active: boolean;
}

export function CommunityUpdateItem({ update }: { update: CommunityUpdate }) {
  return (
    <div className="flex items-start p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-800">
      <div className="flex-shrink-0 mr-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <Users className="w-6 h-6 text-green-500" />
        </div>
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium">{update.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{update.description}</p>
        <p className="text-xs text-gray-400 mt-1">{update.date}</p>
      </div>
    </div>
  );
}
