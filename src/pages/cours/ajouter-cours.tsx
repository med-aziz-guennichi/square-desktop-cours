import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { Book, BookText, FilePlus2, Users2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AjouterCoursPage() {
  const { setSousPages } = useBreadcrumb();
  const navigate = useNavigate();
  useEffect(() => {
    setSousPages([
      { name: 'classes', link: '/dashboard/classes', icon: <Users2 size={16} /> },
      { name: 'matieres', link: () => navigate(-2), icon: <Book size={16} /> },
      { name: 'cours', link: () => navigate(-1), icon: <BookText size={16} /> },
      {
        name: 'ajouter-cours',
        link: 'ajouter-cours',
        icon: <FilePlus2 size={16} />,
      },
    ]);
  }, [setSousPages, navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Ajouter un contenu à la classe</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
