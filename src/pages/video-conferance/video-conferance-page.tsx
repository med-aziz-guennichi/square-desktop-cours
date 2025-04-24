import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { Video } from "lucide-react";
import { useEffect } from "react";
import ConferencePage from "./component/fake-data";

export default function VideoConferancePage() {
  const { setSousPages } = useBreadcrumb();
  useEffect(() => {
    setSousPages([
      { name: 'Réunions', link: '/dashboard/conferance', icon: <Video size={16} /> },
    ]);
  }, [setSousPages]);
  return (
    <div>
      <ConferencePage />
    </div>
  )
}
