export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <nav className="w-full inline-flex items-center px-5 py-3">
        <h1 className="text-xl font-bold mr-auto">KnoWord</h1>
        <ul className="flex space-x-4">
          <li>
            <button className="px-4 py-2 bg-secondary text-color-text font-bold rounded hover:bg-secondary-hover transition duration-300">
              Registrate
            </button>
          </li>
        </ul>
      </nav>
      <main className="flex-1 flex items-center justify-center text-color-text">
        {children}
      </main>
      <footer className="w-full bg-gray-900 text-color-text text-center p-8 mt-8 flex text-sm font-light">
        <p className="">© 2025 KnoWord || Un trabajo de AlphaTech 🦙</p>
        <div className="flex space-x-4 ml-auto">
          <p>Términos y condiciones</p>
          <p>Politica de privacidad</p>
        </div>
      </footer>
    </div>
  );
}
