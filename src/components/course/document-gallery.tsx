import { useDocumentPreview } from '@/pages/cours/hooks/useDocumentPreview';
import { StudyMaterials } from '@/types/cours.interface';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Maximize,
  Minimize,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface DocumentGalleryProps {
  enterprise: string;
  documentData: StudyMaterials;
  itemsPerPage?: number;
}

export function DocumentGallery({
  enterprise,
  documentData,
  itemsPerPage = 5,
}: DocumentGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: docPreview,
    isLoading,
    isError,
  } = useDocumentPreview(
    enterprise,
    documentData.fileName,
    currentPage,
    itemsPerPage,
  );

  const toggleFullScreen = () => {
    if (!imageContainerRef.current) return;

    if (!isFullScreen) {
      if (imageContainerRef.current.requestFullscreen) {
        imageContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const totalPages = docPreview ? Math.ceil(docPreview.total / docPreview.limit) : 0;

  const nextImage = () => {
    if (!docPreview?.images) return;

    if (currentImageIndex < docPreview.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setCurrentImageIndex(0);
    }
  };

  const prevImage = () => {
    if (!docPreview?.images) return;

    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setCurrentImageIndex(itemsPerPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    setCurrentImageIndex(0);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
    setCurrentImageIndex(0);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-[70vh]" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !docPreview?.images?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Document preview not available.
      </div>
    );
  }

  const absoluteImageIndex =
    (currentPage - 1) * itemsPerPage + currentImageIndex + 1;

  return (
    <div className="space-y-4">
      {/* Main Document Image */}
      <div
        ref={imageContainerRef}
        className={`relative rounded-lg overflow-hidden border bg-card ${isFullScreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}
      >
        <img
          src={docPreview.images[currentImageIndex]}
          alt={`${documentData.displayName} - Page ${absoluteImageIndex}`}
          className={`w-full h-auto mx-auto ${isFullScreen ? 'object-contain h-full' : 'max-h-[70vh] object-contain'}`}
        />

        <div className="absolute inset-0 flex items-center justify-between p-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background"
            onClick={prevImage}
            disabled={currentPage === 1 && currentImageIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background"
            onClick={nextImage}
            disabled={
              currentPage === totalPages &&
              currentImageIndex === docPreview.images.length - 1
            }
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="inline-flex items-center gap-2 bg-background/80 px-4 py-1 rounded-full text-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <span>
              Page {absoluteImageIndex} of {docPreview.total}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Fullscreen Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
          onClick={toggleFullScreen}
        >
          {isFullScreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Thumbnail Gallery - Hide in fullscreen mode */}
      {!isFullScreen && (
        <div className="flex flex-wrap gap-2 justify-center">
          {docPreview.images.map((image, index) => (
            <button
              key={index}
              className={`
                flex-shrink-0 w-20 h-28 rounded-md overflow-hidden border-2 transition-all
                ${currentImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}
              `}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={image}
                alt={`Thumbnail page ${(currentPage - 1) * itemsPerPage + index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Pagination Controls - Hide in fullscreen mode */}
      {!isFullScreen && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
