// components/ExcalidrawWrapper.tsx
"use client"; // If using Next.js App Router

import type {
  ExcalidrawElement,
  AppState,
} from "@excalidraw/excalidraw/types/types";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css"; // Essential CSS import

// Dynamically import the Excalidraw component, disabling SSR
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => <div className="h-[500px] w-full">Loading...</div>, // Optional loading state
  },
);

interface ExcalidrawWrapperProps {
  onChange: (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
  ) => void;
}

const ExcalidrawWrapper = ({ onChange }: ExcalidrawWrapperProps) => {
  // Excalidraw takes 100% of its parent's width and height,
  // so ensure the container has non-zero dimensions
  return (
    <div className="h-[600px] w-full border border-gray-300">
      <Excalidraw onChange={onChange} />
    </div>
  );
};

export default ExcalidrawWrapper;
