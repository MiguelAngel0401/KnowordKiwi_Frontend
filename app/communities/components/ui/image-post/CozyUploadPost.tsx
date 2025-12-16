import React, { useState, useRef, Fragment, useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { uploadToCloudinary } from "@/services/cloudinary/cloudinaryService";
import privateApiClient from "@/services/client/privateApiClient";
import ErrorModal from "@/components/modals/ErrorModal";

interface CozyUploadPostProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: number;
}

const CozyUploadPost: React.FC<CozyUploadPostProps> = ({
  isOpen,
  onClose,
  communityId,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fileRef.current = file;
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
      fileRef.current = file;
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

  const handlePublish = async () => {
    if (!imagePreview || !fileRef.current || !title) return;

    try {
      setIsUploading(true);
      setError(null);

      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(fileRef.current);

      const response = await privateApiClient.post(
        `/posts/image/${communityId}`,
        {
          title,
          imageUrl,
          description,
          tags,
        },
      );

      if (!response.data) {
        throw new Error("Failed to create image post");
      }

      // Show success notification
      setShowSuccess(true);

      // Reset form
      setImagePreview(null);
      setTitle("");
      setDescription("");
      setTags([]);
      fileRef.current = null;

      // Close modal after a short delay to show success
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al subir la imagen. Por favor, inténtalo de nuevo.";
      setError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setIsUploading(false);
    }
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
                    disabled={isUploading}
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
                    disabled={isUploading}
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
                    Título
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans bg-white"
                    placeholder="Escribe un título para tu imagen..."
                    disabled={isUploading}
                  />
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
                      disabled={isUploading}
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
                            disabled={isUploading}
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
                    disabled={isUploading}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-sans"
                    disabled={isUploading}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-sans"
                    disabled={!imagePreview || !title || isUploading}
                    onClick={handlePublish}
                  >
                    {isUploading ? "Publicando..." : "Publicar"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>

      {/* Success Toast */}
      <Transition
        show={showSuccess}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transform ease-in duration-100 transition"
        leaveFrom="translate-y-0 opacity-100 sm:translate-x-0"
        leaveTo="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      >
        <div className="fixed z-50 inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
          <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            <div className="max-w-sm w-full bg-green-500 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-white">
                      ¡Imagen publicada exitosamente!
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="text-white hover:text-gray-200"
                      onClick={() => setShowSuccess(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      {/* Error Modal */}
      <ErrorModal
        message={error || "Ha ocurrido un error al publicar la imagen"}
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setError(null);
        }}
      />
    </Transition>
  );
};

export default CozyUploadPost;
