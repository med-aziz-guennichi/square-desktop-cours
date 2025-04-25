import { useDocumentPreview } from '@/pages/cours/hooks/useDocumentPreview';
import { StudyMaterials } from '@/types/cours.interface';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
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
  const [zoom, setZoom] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await imageContainerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      // Reset zoom when exiting fullscreen
      if (!document.fullscreenElement) {
        setZoom(1);
      }
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
    setZoom(1); // Reset zoom when changing images
  };

  const prevImage = () => {
    if (!docPreview?.images) return;
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setCurrentImageIndex(itemsPerPage - 1);
    }
    setZoom(1); // Reset zoom when changing images
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    setCurrentImageIndex(0);
    setZoom(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
    setCurrentImageIndex(0);
    setZoom(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-[70vh]" />
        <div className="flex gap-2 overflow-x-auto py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-28 flex-shrink-0" />
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
      {/* Main Image Container */}
      <div
        ref={imageContainerRef}
        className={`relative rounded-lg border bg-card overflow-hidden ${
          isFullScreen ? 'fixed inset-0 z-50 bg-background' : 'w-full'
        }`}
      >
        <div
          className={`${isFullScreen ? 'h-full w-full overflow-auto' : 'max-h-[70vh] overflow-hidden'}`}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            height: isFullScreen ? '100%' : 'auto',
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.3s ease',
              display: 'inline-block',
            }}
          >
            <img
              ref={imageRef}
              src={docPreview.images[currentImageIndex]}
              alt={`${documentData.displayName} - Page ${absoluteImageIndex}`}
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background pointer-events-auto"
            onClick={prevImage}
            disabled={currentPage === 1 && currentImageIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background pointer-events-auto"
            onClick={nextImage}
            disabled={
              currentPage === totalPages &&
              currentImageIndex === docPreview.images.length - 1
            }
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Bottom Center Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
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

        {/* Fullscreen + Zoom Buttons (top right) */}
        <div className="absolute top-2 right-2 flex gap-2 bg-background/80 p-1 rounded-md">
          {isFullScreen && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
            {isFullScreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      {!isFullScreen && (
        <div className="flex overflow-x-auto py-2 gap-2">
          {docPreview.images.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-20 h-28 rounded-md overflow-hidden border-2 transition-all ${
                currentImageIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setCurrentImageIndex(index);
                setZoom(1);
              }}
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

      {/* Pagination Controls */}
      {!isFullScreen && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              setCurrentImageIndex(0);
              setZoom(1);
            }}
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
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              setCurrentImageIndex(0);
              setZoom(1);
            }}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
