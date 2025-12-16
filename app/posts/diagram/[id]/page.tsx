"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import privateApiClient from "@/services/client/privateApiClient";
import ExcalidrawWrapper from "@/app/posts/diagram/components/ExcalidrawWrapper";
import type {
  ExcalidrawElement,
  AppState,
} from "@excalidraw/excalidraw/types/types";
import ErrorMessageScreen from "@/components/shared/ErrorMessageScreen";

interface DiagramData {
  id: number;
  title: string;
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  createdAt: string;
  updatedAt: string;
  author: {
    user: {
      username: string;
      realName: string;
    };
  };
}

export default function ViewDiagramPage() {
  const { id } = useParams();
  const [diagram, setDiagram] = useState<DiagramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagram = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get the post to get the diagram content
        const response = await privateApiClient.get(`/posts/${id}`);
        const postData = response.data;

        // Extract diagram data from the post
        if (!postData.excalidrawContent) {
          setError("El diagrama no existe o no se puede acceder.");
          return;
        }

        const diagramData = {
          id: postData.id,
          title: postData.title,
          elements: postData.excalidrawContent.diagramData.elements || [],
          appState: postData.excalidrawContent.diagramData.appState || {},
          createdAt: postData.createdAt,
          updatedAt: postData.updatedAt,
          author: postData.author,
        };

        setDiagram(diagramData);
      } catch (err: any) {
        console.error("Error fetching diagram:", err);
        setError(
          err.response?.data?.message ||
            "No se pudo cargar el diagrama. Inténtalo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDiagram();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessageScreen error={error} />;
  }

  if (!diagram) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-text-color">
          Diagrama no encontrado
        </h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-serif text-stone-800 mb-2">
            {diagram.title}
          </h1>
          <p className="text-stone-600">
            por{" "}
            <span className="font-semibold">
              {diagram.author.user.username}
            </span>
            <span className="mx-2">•</span>
            {new Date(diagram.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <ExcalidrawWrapper
            initialData={{
              elements: diagram.elements,
              appState: {
                ...diagram.appState,
                viewModeEnabled: true, // Enable read-only view mode
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
