type ErrorMessageScreenProps = { error: string };

export default function ErrorMessageScreen({ error }: ErrorMessageScreenProps) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-bg-default rounded-xl border border-terciary shadow-lg p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text-color">
          ¡Ups! Algo salió mal
        </h2>
        {(error && (
          <p className="text-sm text-error font-medium">{error}</p>
        )) || (
          <p className="text-gray-800">
            No pudimos conectar con el servidor. ¡Pero no te preocupes! Estamos
            trabajando para solucionarlo.
          </p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
