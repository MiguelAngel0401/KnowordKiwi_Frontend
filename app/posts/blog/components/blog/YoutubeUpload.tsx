"use client";

import { Button } from "@headlessui/react";
import { Youtube } from "lucide-react";
import { Editor } from "@tiptap/react";
import { useState } from "react";
interface YoutubeUploadProps {
  editor: Editor | null;
}

export default function YoutubeUpload({ editor }: YoutubeUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !editor) return;

    const start = startTime ? parseInt(startTime, 10) : 0;

    editor.commands.setYoutubeVideo({
      src: url,
      start: isNaN(start) ? 0 : start,
    });

    // Reset form
    setUrl("");
    setStartTime("");
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        title="Insertar video de YouTube"
      >
        <Youtube className="size-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              Insertar video de YouTube
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="youtube-url"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  URL del video
                </label>
                <input
                  id="youtube-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="start-time"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Tiempo de inicio (opcional)
                </label>
                <input
                  id="start-time"
                  type="number"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Segundos después del inicio del video
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
                >
                  Insertar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
