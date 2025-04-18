import { useUserStore } from '@/store/user-store';
import { Chapters } from '@/types/cours.interface';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { ScrollBar } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { VideoPlayer } from './video-player';

export function CourseContent({ data }: { data: Chapters }) {
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
      <div className="space-y-4">
        {data?.type === 'Video' ? (
          <div className="space-y-4">
            {/* Main Video Player */}
            <div className="rounded-lg overflow-hidden border bg-card">
              <VideoPlayer
                url={`${import.meta.env.VITE_API_BASE_URL}/desktop-app/video/${user?.enterprise}/${activeVideo}`}
              />
            </div>

            {/* Video Gallery (only show if there are multiple videos) */}
            {data.studyMaterials.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-3">Video Gallery</h3>
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-4 pb-2">
                      {data.studyMaterials.map((material, index) => (
                        <VideoThumbnail
                          key={index}
                          title={material.displayName || `Video ${index + 1}`}
                          isActive={material.fileName === activeVideo}
                          onClick={() => setActiveVideo(material.fileName)}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        ) : data?.type === 'Document' ? (
          <Tabs defaultValue="document-1" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              {data.studyMaterials.map((material, index) => (
                <TabsTrigger key={index} value={`document-${index + 1}`}>
                  {material.displayName || `Document ${index + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>
            {data.studyMaterials.map((_, index) => (
              <TabsContent
                key={index}
                value={`document-${index + 1}`}
                className="border rounded-lg p-4"
              >
                {/* <iframe
                  src={`${import.meta.env.VITE_API_BASE_URL}/document/${material.fileName}`}
                  className="w-full h-[600px]"
                /> */}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Unsupported content type
          </div>
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
