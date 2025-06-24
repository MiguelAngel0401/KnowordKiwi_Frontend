import { Home, Compass, Users, Bookmark, Settings } from 'lucide-react';

export default function Page() {
  return (
    <div>
      <h1 className="text-white text-2xl mb-4">Landing Page</h1>

      <div className="text-white">
        <ol className="space-y-4">
          <li className="flex items-center gap-2"><Home size={20}/>Inicio</li>
          <li className="flex items-center gap-2"><Compass size={20} />Explorar</li>
          <li className="flex items-center gap-2"><Users size={20} />Comunidades</li>
          <li className="flex items-center gap-2"><Bookmark size={20} />Cursos</li>
          <li className="flex items-center gap-2">
            <Settings size={20} />
            Configuración
          </li>
        </ol>
      </div>
    </div>
  );
}
