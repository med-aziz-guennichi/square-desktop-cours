'use client';

import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { FormField } from '@/components/ui/form';
import { cancelAllRequests, golangInstance as instance } from '@/lib/axios';
import { AxiosProgressEvent } from 'axios';
import { Upload, X } from 'lucide-react';
import * as React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface FileUploadCircularProgressDemoProps {
  maxFiles: number;
  form: UseFormReturn<FieldValues, object, FieldValues>;
  index: number;
  accept: string;
  enterpriseId?: string;
}

interface StudyMaterial {
  fileName: string;
  displayName: string;
}

export function FileUploadCircularProgressDemo({
  maxFiles,
  form,
  index,
  accept,
  enterpriseId,
}: FileUploadCircularProgressDemoProps) {
  const [files, setFiles] = React.useState<File[]>(() => {
    const initialFiles = form.getValues(`chapters.${index}.files`);
    return initialFiles ? [...initialFiles] : [];
  });

  React.useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === `chapters.${index}.files`) {
        const watchedFiles = values.chapters?.[index]?.files ?? [];
        setFiles((prevFiles) => {
          const prevFilesStr = prevFiles.map((f) => `${f.name}-${f.size}`).join(',');
          const newFilesStr = watchedFiles
            .map((f: File) => `${f.name}-${f.size}`)
            .join(',');
          if (prevFilesStr !== newFilesStr) {
            return watchedFiles;
          }
          return prevFiles;
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, index]);

  const uploadFile = React.useCallback(
    async (
      file: File,
      onProgress: (file: File, progress: number, eta?: string) => void,
    ): Promise<string> => {
      const formData = new FormData();
      formData.append('enterpriseId', enterpriseId!);
      formData.append('file', file);

      const startTime = Date.now();

      const config = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const now = Date.now();
          const timeElapsed = (now - startTime) / 1000; // seconds
          const loaded = progressEvent.loaded;
          const total = progressEvent.total ?? file.size;
          const percentCompleted = Math.round((loaded * 100) / total);

          const speed = loaded / timeElapsed; // bytes per second
          const remainingBytes = total - loaded;
          const estimatedSeconds = remainingBytes / speed;
          const eta = new Date(estimatedSeconds * 1000).toISOString().substr(14, 5); // mm:ss

          onProgress(file, percentCompleted, eta);
        },
      };

      const response = await instance.post('/upload', formData, config);

      if (!response.data.success) {
        throw new Error('File upload failed');
      }

      return response.data.filename;
    },
    [enterpriseId],
  );

  const removeFile = React.useCallback(
    (fileToRemove: File) => {
      setFiles((prevFiles) => {
        const newFiles = prevFiles.filter(
          (file) => `${file.name}-${file.size}` !== `${fileToRemove.name}-${fileToRemove.size}`,
        );
        form.setValue(`chapters.${index}.files`, newFiles);
        return newFiles;
      });
    },
    [form, index],
  );

  const onUpload = React.useCallback(
    async (
      newFiles: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      },
    ) => {
      try {
        await Promise.all(
          newFiles.map(async (file) => {
            try {
              await toast.promise(
                uploadFile(file, (f, progress, eta) => {
                  onProgress(f, progress);
                  toast.loading(
                    `Uploading ${file.name}: ${progress}%${eta ? ` (Time Remaining: ${eta})` : ''}`,
                    { id: file.name },
                  );
                }),
                {
                  loading: `Uploading ${file.name}...`,
                  success: (filename) => {
                    const currentStudyMaterials: StudyMaterial[] =
                      form.getValues(`chapters.${index}.studyMaterials`) ?? [];

                    form.setValue(`chapters.${index}.studyMaterials`, [
                      ...currentStudyMaterials,
                      {
                        fileName: filename,
                        displayName: file.name,
                      },
                    ]);

                    onSuccess(file);
                    return `${file.name} uploaded successfully`;
                  },
                  error: (error) => {
                    onError(file, error);
                    removeFile(file);
                    return `${file.name} failed to upload: ${error.message}`;
                  },
                  id: file.name,
                },
              );
            } catch (err) {
              removeFile(file);
              console.error('Upload error:', err);
            }
          }),
        );
      } catch (err) {
        console.error('Batch upload error:', err);
      }
    },
    [uploadFile, form, index, removeFile],
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <FormField
      control={form.control}
      name={`chapters.${index}.files`}
      render={() => (
        <FileUpload
          value={files}
          onValueChange={(newFiles) => {
            setFiles(newFiles);
            form.setValue(`chapters.${index}.files`, newFiles);
          }}
          maxFiles={maxFiles}
          className="w-full"
          onUpload={onUpload}
          onFileReject={onFileReject}
          accept={accept}
          multiple
        >
          <FileUploadDropzone>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center rounded-full border p-2.5">
                <Upload className="size-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">Drag & drop files here</p>
              <p className="text-muted-foreground text-xs">
                Or click to browse (max {maxFiles} files)
              </p>
            </div>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2 w-fit">
                Browse files
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList orientation="horizontal">
            {files.map((file, i) => (
              <FileUploadItem
                key={`${file.name}-${file.size}-${i}`}
                value={file}
                className="p-0"
              >
                <FileUploadItemPreview className="size-15" />
                <FileUploadItemMetadata className="sr-only" />
                <FileUploadItemDelete asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      cancelAllRequests();
                      removeFile(file);
                    }}
                    className="-top-1 -right-1 absolute size-5 rounded-full"
                  >
                    <X className="size-3" />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      )}
    />
  );
}

export default FileUploadCircularProgressDemo;