"use client";

import { Button } from "@headlessui/react";
import { Image as ImageIcon, Upload } from "lucide-react";
import { Editor } from "@tiptap/react";
import { useRef, useState } from "react";
import { uploadToCloudinary } from "@/services/cloudinary/cloudinaryService";
import InfoModal from "@/components/shared/InfoModal";

interface ImageUploadProps {
  editor: Editor | null;
}

export default function ImageUpload({ editor }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Validar que el archivo sea una imagen
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecciona un archivo de imagen.");
      return;
    }

    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es demasiado grande. El tamaño máximo es 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      // Subir la imagen a Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      // Insertar la imagen en el editor usando la URL devuelta por Cloudinary
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setError("Error al subir la imagen. Por favor, inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`p-2 rounded-md transition-colors ${
          isUploading
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:bg-secondary hover:text-white"
        }`}
        title={isUploading ? "Subiendo imagen..." : "Insertar imagen"}
      >
        {isUploading ? (
          <>
            <Upload className="size-4 animate-pulse" />
            <span className="text-xs">Subiendo...</span>
          </>
        ) : (
          <ImageIcon className="size-4" />
        )}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      {error && (
        <InfoModal
          isOpen={!!error}
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </>
  );
}
