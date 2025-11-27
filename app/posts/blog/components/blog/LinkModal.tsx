"use client";

import { Button } from "@headlessui/react";
import { Link as LinkIcon } from "lucide-react";
import { Editor } from "@tiptap/react";
import { useState, useEffect } from "react";

interface LinkModalProps {
  editor: Editor | null;
}

export default function LinkModal({ editor }: LinkModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  // Actualizar el texto cuando se selecciona algo en el editor
  useEffect(() => {
    if (!editor) return;

    const updateText = () => {
      const selection = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(
        selection.from,
        selection.to,
        " ",
      );
      setText(selectedText);
    };

    editor.on("selectionUpdate", updateText);
    editor.on("transaction", updateText);

    return () => {
      editor.off("selectionUpdate", updateText);
      editor.off("transaction", updateText);
    };
  }, [editor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !editor) return;

    // Validar URL
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      alert("Por favor ingresa una URL válida");
      return;
    }

    // Asegurarse de que la URL tenga el protocolo
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    // Si hay texto seleccionado, usarlo como texto del enlace
    if (text) {
      editor.chain().focus().setLink({ href: fullUrl }).run();
    } else {
      // Si no hay texto seleccionado, insertar el enlace con el texto proporcionado
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: text || url,
          marks: [
            {
              type: "link",
              attrs: {
                href: fullUrl,
              },
            },
          ],
        })
        .run();
    }

    // Reset form
    setUrl("");
    setText("");
    setIsOpen(false);
  };

  const handleUnlink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  };

  // Verificar si hay un enlace en la selección actual
  const isLinkActive = () => {
    if (!editor) return false;
    return editor.isActive("link");
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-md transition-colors ${
          isLinkActive()
            ? "bg-gray-700 text-white"
            : "text-gray-600 hover:bg-secondary hover:text-white"
        }`}
        title="Insertar enlace"
      >
        <LinkIcon className="size-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-default rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {isLinkActive() ? "Editar enlace" : "Insertar enlace"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="link-text"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Texto a mostrar
                </label>
                <input
                  id="link-text"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-gray border-b border-secondary text-text-color placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Texto del enlace"
                />
                <p className="mt-1 text-xs text-gray-600">
                  Si no se especifica, se usará la URL como texto
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="link-url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL
                </label>
                <input
                  id="link-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-gray border-b border-secondary  text-text-color placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                {isLinkActive() && (
                  <Button
                    type="button"
                    onClick={handleUnlink}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Eliminar enlace
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-text-color transition-colors"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
                >
                  {isLinkActive() ? "Actualizar" : "Insertar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
