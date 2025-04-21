import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ClickedChapter } from '@/pages/cours/ajouter-cours';
import { useUserStore } from '@/store/user-store';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextEditorOne } from './text-editor-one';
import { UploadDocuments } from './upload-documents';
import { FileUploadCircularProgressDemo } from './upload-files';
import { useSafeNavigation } from '@/hooks/use-save-navigation';
import { ActionConfirmationDialog } from '@/components/save-navigation-dialog';

export const ClickedShapterForm = ({
  clickedChapter,
  setClickedChapter,
}: {
  clickedChapter: ClickedChapter;
  setClickedChapter: (chapter: ClickedChapter) => void;
}) => {
  const form = useFormContext();
  const user = useUserStore().decodedUser;
  const {
    showConfirm,
    attemptAction,
    executePendingAction,
    cancelAction,
  } = useSafeNavigation();
  const [selectedValue, setSelectedValue] = useState<string>(
    clickedChapter.type || 'Video',
  );
  const [documentType, setDocumentType] = useState<string>(
    clickedChapter.typeDocument || 'word',
  );

  // Initialize form values based on clickedChapter
  useEffect(() => {
    if (clickedChapter.index !== null) {
      // Only initialize if values aren't already set
      if (!form.getValues(`chapters.${clickedChapter.index}.type`)) {
        form.setValue(
          `chapters.${clickedChapter.index}.type`,
          clickedChapter.type || 'Video',
        );
      }
      if (
        !form.getValues(`chapters.${clickedChapter.index}.typeDocument`) &&
        clickedChapter.type === 'Document'
      ) {
        form.setValue(
          `chapters.${clickedChapter.index}.typeDocument`,
          clickedChapter.typeDocument || 'word',
        );
      }
    }
  }, [clickedChapter.index, clickedChapter.type, clickedChapter.typeDocument, form]);

  const handleTypeChange = (val: string) => {
    setSelectedValue(val);
    form.setValue(`chapters.${clickedChapter.index}.type`, val);
    // Update clickedChapter to preserve the type when exiting
    setClickedChapter({
      ...clickedChapter,
      type: val as 'Video' | 'Document' | 'Quiz',
    });
  };

  const handleDocumentTypeChange = (type: string) => {
    setDocumentType(type);
    form.setValue(`chapters.${clickedChapter.index}.typeDocument`, type);
    // Update clickedChapter to preserve the document type when exiting
    setClickedChapter({
      ...clickedChapter,
      typeDocument: type,
    });
  };

  if (clickedChapter.index === null) return null;

  const chapterTitle =
    form.watch(`chapters.${clickedChapter.index}.title`) || 'Untitled';

    const handleBackClick = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      const action = () => {
        setClickedChapter({
          ...clickedChapter,
          id: null,
        });
      };
    
      attemptAction(action);
    };
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackClick}
              >
                <ArrowLeft size={20} />
              </Button>
              <CardTitle className="font-semibold truncate overflow-hidden whitespace-nowrap max-w-[400px]">
                Contenu du {chapterTitle}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Select value={selectedValue} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={selectedValue} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
              {selectedValue === 'Document' && (
                <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="word">Text Editor</SelectItem>
                    <SelectItem value="excel">Spreadsheet Editor</SelectItem>
                    <SelectItem value="upload">Upload File</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <CardDescription>Organisez votre cours en modules et leçons</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name={`chapters.${clickedChapter.index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Introduction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`chapters.${clickedChapter.index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description du chapitre..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {selectedValue === 'Video' ? (
            <FileUploadCircularProgressDemo
              accept="video/*,.mp4,.mkv,.avi,.webm,.mov"
              maxFiles={5}
              index={clickedChapter.index}
              form={form}
              enterpriseId={user?.enterprise}
            />
          ) : selectedValue === 'Document' ? (
            documentType === 'upload' ? (
              <UploadDocuments
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg"
                maxFiles={5}
                index={clickedChapter.index}
                form={form}
              />
            ) : documentType === 'word' ? (
              <TextEditorOne form={form} index={clickedChapter.index} />
            ) : (
              <p>Spreadsheet editor coming soon</p>
            )
          ) : (
            <>Quizz</>
          )}
        </CardContent>
      </Card>
      <ActionConfirmationDialog
        open={showConfirm}
        onConfirm={executePendingAction}
        onCancel={cancelAction}
      />
    </>
  );
};
