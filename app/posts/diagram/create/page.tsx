"use client";
import { useState } from "react";
import type {
  ExcalidrawElement,
  AppState,
} from "@excalidraw/excalidraw/types/types";
import ExcalidrawWrapper from "../components/ExcalidrawWrapper";

export default function CreateDiagramPage() {
  const [title, setTitle] = useState("");
  const [elements, setElements] = useState<readonly ExcalidrawElement[]>([]);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDiagramChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
  ) => {
    setElements(elements);
    setAppState(appState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (elements.length === 0 || !title.trim()) {
      setError("El título y el diagrama no pueden estar vacíos.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const diagramData = {
      title,
      elements,
      appState,
    };

    try {
      // Aquí harías la llamada a tu API
      // const response = await fetch('/api/posts/diagram', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(diagramData),
      // });
      // if (!response.ok) throw new Error('Error al guardar el diagrama');

      console.log("Enviando al backend:", JSON.stringify(diagramData, null, 2));
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular llamada a API

      setSuccess("¡Diagrama guardado con éxito!");
      setTitle("");
      // Podrías resetear Excalidraw si es necesario
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Diagrama</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Título del Diagrama
          </label>
          <div className="flex space-x-4">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej. Arquitectura de la aplicación"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Diagrama"}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>

        <ExcalidrawWrapper onChange={handleDiagramChange} />
      </form>
    </div>
  );
}
