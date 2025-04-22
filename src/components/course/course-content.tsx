import { useUserStore } from '@/store/user-store';
import { Chapters } from '@/types/cours.interface';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { DocumentGallery } from './document-gallery';
import { VideoPlayer } from './video-player';

export function CourseContent({ data }: { data: Chapters }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(
    data?.studyMaterials?.[0]?.fileName,
  );
  const user = useUserStore().decodedUser;

  useEffect(() => {
    if (!activeVideo) {
      setActiveVideo(data?.studyMaterials?.[0]?.fileName);
    }
  }, [activeVideo, data?.studyMaterials]);

  // Handle case when there are no study materials
  if (!data?.studyMaterials?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No content available
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row gap-6">
        {/* Left: Main content area */}
        <div className="flex-1">
          {data?.type === 'Document' ? (
            <DocumentGallery
              enterprise={user?.enterprise || ''}
              documentData={data.studyMaterials[activeIndex]}
            />
          ) : data?.type === 'Video' ? (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border bg-card">
                <VideoPlayer
                  url={`${import.meta.env.VITE_API_BASE_URL}/desktop-app/video/${user?.enterprise}/${data.studyMaterials[activeIndex].fileName}`}
                />
              </div>

              {data.studyMaterials.length > 1 && (
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-4 pb-2">
                    {data.studyMaterials.map((material, index) => (
                      <VideoThumbnail
                        key={index}
                        title={material.displayName || `Video ${index + 1}`}
                        isActive={index === activeIndex}
                        onClick={() => setActiveIndex(index)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Unsupported content type
            </div>
          )}
        </div>

        {/* Right: Sidebar with list */}
        {data?.type === 'Document' && (
          <aside className="w-64 border-l pl-4">
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-2">
                {data.studyMaterials.map((material, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${index === activeIndex
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted'
                      }`}
                  >
                    {material.displayName || `Document ${index + 1}`}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}
      </div>
    </div>
  );
}

function VideoThumbnail({
  title,
  isActive,
  onClick,
}: {
  title: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`
          relative group cursor-pointer flex-shrink-0 w-48 h-28 
          rounded-md overflow-hidden border-2 transition-all
          ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}
        `}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {/* Placeholder thumbnail - in a real app, you might want to generate thumbnails */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
        <Play
          className={`w-10 h-10 ${isActive ? 'text-primary' : 'text-primary/70'} group-hover:text-primary transition-colors`}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs font-medium text-white truncate">
        {title}
      </div>
    </div>
  );
}
