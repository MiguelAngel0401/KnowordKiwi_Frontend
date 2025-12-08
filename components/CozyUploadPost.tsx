import React, { useState, useRef, Fragment } from "react";
import { X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

interface CozyUploadPostProps {
  isOpen: boolean;
  onClose: () => void;
}

const CozyUploadPost: React.FC<CozyUploadPostProps> = ({ isOpen, onClose }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputTag.trim()) {
      e.preventDefault();
      if (!tags.includes(inputTag.trim())) {
        setTags([...tags, inputTag.trim()]);
      }
      setInputTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const getRandomTagColor = () => {
    const colors = [
      "bg-red-100",
      "bg-green-100",
      "bg-blue-100",
      "bg-yellow-100",
      "bg-purple-100",
      "bg-pink-100",
      "bg-indigo-100",
      "bg-teal-100",
      "bg-orange-100",
      "bg-lime-100",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-[#FDFBF7] p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h2" className="text-2xl font-bold">
                    Agregar Imagen
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer mb-6 transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={handleFileClick}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {imagePreview ? (
                    <div className="flex justify-center">
                      <div className="border-8 border-white shadow-xl rotate-1 transform transition-transform hover:rotate-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 object-contain rounded"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <p>
                        Arrastra y suelta una imagen aquí o haz clic para
                        seleccionar
                      </p>
                      <p className="text-sm mt-1">
                        Formatos admitidos: JPG, PNG, GIF
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Descripción
                  </label>
                  <div className="border rounded-lg overflow-hidden bg-white relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-4 h-32 resize-none focus:outline-none font-medium"
                      placeholder="Escribe tu descripción aquí..."
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Etiquetas
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className={`${getRandomTagColor()} px-3 py-1 text-sm font-medium shadow-sm transform rotate-1`}
                        style={{
                          borderRadius: "6px 10px 4px 8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        <span className="flex items-center">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={inputTag}
                    onChange={(e) => setInputTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    placeholder="Presiona Enter para agregar una etiqueta..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-sans"
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-sans"
                    disabled={!imagePreview}
                  >
                    Publicar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CozyUploadPost;
