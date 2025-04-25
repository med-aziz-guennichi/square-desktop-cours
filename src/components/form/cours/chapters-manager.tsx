'use client';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  FieldErrors,
  FieldValues,
  UseFieldArrayAppend,
  useFormContext,
} from 'react-hook-form';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ClickedChapter } from '@/pages/cours/ajouter-cours';
interface ChaptersManagerProps {
  fields: Record<'id', string>[];
  append: UseFieldArrayAppend<FieldValues, 'chapters'>;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  formErrors: FieldErrors<FieldValues>;
  setClickedShapter: (chapter: ClickedChapter) => void;
}

export function ChaptersManager({
  fields,
  append,
  remove,
  move,
  formErrors,
  setClickedShapter,
}: ChaptersManagerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<{
    index: number;
    title: string;
  } | null>(null);

  const form = useFormContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = fields.findIndex((field) => field.id === active.id);
      const overIndex = fields.findIndex((field) => field.id === over.id);

      move(activeIndex, overIndex);
    }

    setActiveId(null);
  }

  function addNewChapter() {
    append({
      title: '',
      description: '',
      videoUrl: '',
      position: fields.length + 1,
      isPublished: false,
      isFree: false,
    });
  }

  function handleEditChapter() {
    if (editingChapter) {
      form.setValue(`chapters.${editingChapter.index}.title`, editingChapter.title);
      setEditingChapter(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* <h2 className="text-xl font-semibold">Chapitres</h2> */}
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={addNewChapter}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un chapitre
          </Button>
        </div>
      </div>

      {formErrors?.chapters?.message && (
        <Alert variant="destructive">
          <AlertDescription>
            {JSON.stringify(formErrors.chapters.message)}
          </AlertDescription>
        </Alert>
      )}

      {fields.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">Aucun chapitre ajouté</p>
            <Button
              type="button"
              onClick={addNewChapter}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un chapitre
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveId(event.active.id as string)}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="w-full">
              {fields.map((field, index) => (
                <SortableChapterItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  title={form.watch(`chapters.${index}.title`)}
                  isActive={activeId === field.id}
                  onRemove={() => remove(index)}
                  setClickedShapter={setClickedShapter}
                  formErrors={formErrors}
                  onEdit={() =>
                    setEditingChapter({
                      index,
                      title: form.watch(`chapters.${index}.title`) || '',
                    })
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog
        open={!!editingChapter}
        onOpenChange={(open) => !open && setEditingChapter(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le titre du chapitre</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editingChapter?.title || ''}
              onChange={(e) =>
                editingChapter &&
                setEditingChapter({ ...editingChapter, title: e.target.value })
              }
              placeholder="Titre du chapitre"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingChapter(null)}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handleEditChapter}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SortableChapterItemProps {
  id: string;
  index: number;
  title: string;
  isActive: boolean;
  onRemove: () => void;
  onEdit: () => void;
  setClickedShapter: (chapter: ClickedChapter) => void;
  formErrors: FieldErrors<FieldValues>;
}

function SortableChapterItem({
  id,
  index,
  title,
  isActive,
  onRemove,
  onEdit,
  setClickedShapter,
  formErrors,
}: SortableChapterItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });
  const form = useFormContext();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isActive ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full border-b ${isActive ? 'z-10' : 'z-1'}`}
    >
      <div className={`border ${isActive ? 'border-secondary shadow-md' : ''}`}>
        <div
          className="flex items-center justify-between"
          role="button"
          tabIndex={0}
          onClick={() =>
            setClickedShapter({
              id,
              index,
              title,
              description: form.watch(`chapters.${index}.description`),
              type: form.watch(`chapters.${index}.type`),
              quizzes: form.watch(`chapters.${index}.quizzes`),
              studyMaterials: form.watch(`chapters.${index}.studyMaterials`),
              position: form.watch(`chapters.${index}.position`),
            })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // navigate(`ajouter-cours/chapters/${index}`)
              setClickedShapter({
                id,
                index,
                title,
                description: form.watch(`chapters.${index}.description`),
                type: form.watch(`chapters.${index}.type`),
                quizzes: form.watch(`chapters.${index}.quizzes`),
                studyMaterials: form.watch(`chapters.${index}.studyMaterials`),
                position: form.watch(`chapters.${index}.position`),
              });
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="px-2 py-4 cursor-grab touch-none flex items-center justify-center text-muted-foreground hover:text-foreground"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-1 hover:no-underline">
                <span className="font-medium">
                  {title || `Chapitre ${index + 1}`}
                </span>
              </div>
            </div>
            <div>
              {Array.isArray(formErrors?.chapters) && (
                <>
                  {(formErrors.chapters[index]?.title ||
                    formErrors.chapters[index]?.description) && (
                    <Alert variant="destructive" className="border-0 ">
                      <AlertDescription>
                        {`Veuillez cliquer sur le chapitre ${index + 1} pour compléter les détails.`}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 mr-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Modifier</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
