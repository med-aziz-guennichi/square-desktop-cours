import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
const CourseAccessPopup = lazy(() => import('./shared-course-access-popup'));

export function AddCourseButton() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsPopupOpen(true)}>Ajouter cours</Button>
      <Suspense fallback={<Loader2 className='animate-spin' />}>
        {isPopupOpen && (
          <CourseAccessPopup
            open={isPopupOpen}
            onOpenChange={setIsPopupOpen}
          />
        )}
      </Suspense>
    </>
  );
}
