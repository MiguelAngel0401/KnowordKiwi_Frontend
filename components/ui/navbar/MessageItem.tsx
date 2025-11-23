"use client";

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  avatar: string;
  active: boolean;
}

export function MessageItem({ message }: { message: Message }) {
  return (
    <div className="flex items-start p-4 border-b border-gray-100 last:border-b-0 hover:bg-bg-default">
      <div className="flex-shrink-0 mr-3">
        <img
          src={message.avatar}
          alt={`${message.sender}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <p className="text-sm font-bold">{message.sender}</p>
        <p className="text-sm font-light mt-0.5">{message.message}</p>
        <p className="text-xs text-gray-400 mt-1">{message.time}</p>
      </div>
    </div>
  );
}
