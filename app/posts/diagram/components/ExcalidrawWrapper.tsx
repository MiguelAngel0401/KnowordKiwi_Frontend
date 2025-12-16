// components/ExcalidrawWrapper.tsx
"use client"; // If using Next.js App Router

import type {
  ExcalidrawElement,
  AppState,
  BinaryFiles,
} from "@excalidraw/excalidraw/types/types";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css"; // Essential CSS import

interface InitialDataState {
  elements?: readonly ExcalidrawElement[];
  appState?: Partial<AppState>;
  files?: BinaryFiles;
}

// Dynamically import the Excalidraw component, disabling SSR
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => <div className="h-[500px] w-full">Loading...</div>, // Optional loading state
  },
);

interface ExcalidrawWrapperProps {
  onChange?: (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
  ) => void;
  initialData?: InitialDataState;
}

const ExcalidrawWrapper = ({ onChange, initialData }: ExcalidrawWrapperProps) => {
  // Check if we're in view mode based on whether onChange is provided
  const isViewMode = onChange === undefined;

  // Process initialData to ensure proper data types for Excalidraw
  let processedInitialData = initialData;
  if (initialData && initialData.appState) {
    // Create a new appState with proper collaborators Map
    const processedAppState = {
      ...initialData.appState,
      viewModeEnabled: isViewMode,
      // Ensure collaborators is a Map object
      collaborators: initialData.appState.collaborators instanceof Map
        ? initialData.appState.collaborators
        : new Map(),

      // Additional view mode settings
      ...(isViewMode && {
        isCollaborating: false,
        isLibraryOpen: false,
        isHelpPanelOpen: false,
        isWelcomeScreenOpen: false,
        zenModeEnabled: false,
        gridSize: null,
        showStats: false,
        shouldCacheIgnoreZoom: false,
      })
    };

    processedInitialData = {
      ...initialData,
      appState: processedAppState
    };
  }

  // Excalidraw takes 100% of its parent's width and height,
  // so ensure the container has non-zero dimensions
  return (
    <div className="h-[600px] w-full border border-gray-300">
      <Excalidraw
        onChange={onChange}
        initialData={processedInitialData}
      />
    </div>
  );
};

export default ExcalidrawWrapper;
