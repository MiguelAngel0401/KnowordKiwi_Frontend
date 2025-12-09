// app/page.tsx (or a different page file)

import ExcalidrawWrapper from "../components/ExcalidrawWrapper";

export default function HomePage() {
  return (
    <div>
      <h1>My Next.js Excalidraw Integration</h1>
      <ExcalidrawWrapper />
    </div>
  );
}
