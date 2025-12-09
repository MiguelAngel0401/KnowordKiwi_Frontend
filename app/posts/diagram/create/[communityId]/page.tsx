"use client";
import { useState } from "react";
import type {
  ExcalidrawElement,
  AppState,
} from "@excalidraw/excalidraw/types/types";
import ExcalidrawWrapper from "../../components/ExcalidrawWrapper";

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
    <div className="min-h-screen bg-stone-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-serif text-stone-800 mb-8">
          Crea un Nuevo Diagrama
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-stone-600 mb-2"
            >
              Título del Diagrama
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
                placeholder="Ej. Arquitectura de mi aplicación..."
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="mt-3 sm:mt-0 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
            {success && (
              <p className="text-emerald-700 mt-2 text-sm">{success}</p>
            )}
          </div>

          <ExcalidrawWrapper onChange={handleDiagramChange} />
        </form>
      </div>
    </div>
  );
}
