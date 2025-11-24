"use client";
import { Trophy, Users } from "lucide-react";

interface Notification {
  id: number;
  type: "achievement" | "rank" | "achievement-knoword";
  title: string;
  date: string;
  points?: string;
  actionText?: string;
  active?: boolean;
}

export function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const renderIcon = () => {
    switch (notification.type) {
      case "achievement":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-blue-500" />
          </div>
        );
      case "rank":
        return (
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-pink-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.096-.134 2.164-.386 3.197M19.121 21.021A7.5 7.5 0 0012 24a7.5 7.5 0 00-7.121-2.979M2.879 21.021A7.5 7.5 0 0112 0c1.096 0 2.164.134 3.197.386M21.021 2.879A7.5 7.5 0 010 12c0-1.096.134-2.164.386-3.197M2.879 2.879A7.5 7.5 0 0012 0c1.096 0 2.164.134 3.197.386M21.021 21.021A7.5 7.5 0 0012 24a7.5 7.5 0 00-7.121-2.979M21.021 2.879A7.5 7.5 0 0112 0c-1.096 0-2.164.134-3.197.386"
              />
            </svg>
          </div>
        );
      case "achievement-knoword":
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-500" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start p-4 border-b border-gray-100 last:border-b-0 hover:bg-bg-default">
      <div className="flex-shrink-0 mr-3">{renderIcon()}</div>
      <div className="flex-grow">
        <p className="text-sm font-medium">{notification.title}</p>
        {notification.points && (
          <p className="text-xs text-gray-500 mt-0.5">
            <span className="font-bold text-green-600">
              {notification.points}
            </span>{" "}
            añadidos a tu cuenta.
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
        {notification.actionText && (
          <button className="mt-2 px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-gray-600">
            {notification.actionText}
          </button>
        )}
      </div>
    </div>
  );
}
