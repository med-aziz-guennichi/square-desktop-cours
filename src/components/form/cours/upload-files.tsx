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
import { invoke } from '@tauri-apps/api/core';
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

async function resizeVideo(filePath: string, width: number, height: number): Promise<string> {
  try {
    const resizedPath = await invoke<string>('resize_video', {
      inputPath: filePath,
      width,
      height,
    });

    return resizedPath;
  } catch (error) {
    console.error('Video resizing failed:', error);
    throw new Error('Video resizing failed');
  }
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
      onProgress: (file: File, progress: number) => void,
    ): Promise<string> => {
      try {
        // Save the uploaded file locally in the backend
        const filePath = await invoke<string>('save_uploaded_file', {
          file: await file.arrayBuffer(),
          fileName: file.name
        });

        // Resize the video and get the output path
        const resizedPath = await resizeVideo(filePath, 640, 360);

        // Instead of fetching file://, read the resized file as a Blob
        const resizedBlob = await invoke("read_resized_file", {
          path: resizedPath
        }).then((fileBuffer) => {
          const buffer = fileBuffer as ArrayBuffer;
          return new Blob([buffer], { type: 'video/mp4' });
        });

        const resizedFile = new File([resizedBlob], file.name, { type: file.type });

        const formData = new FormData();
        formData.append('enterpriseId', enterpriseId!);
        formData.append('file', resizedFile);

        const config = {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            onProgress(file, percentCompleted);
          },
        };

        const response = await instance.post('/upload', formData, config);
        if (!response.data.success) {
          throw new Error('File upload failed');
        }

        return response.data.filename;
      } catch (error) {
        console.error('Upload with resize failed:', error);
        throw error;
      }
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
                uploadFile(file, (f, progress) => {
                  onProgress(f, progress);
                  toast.loading(`Uploading ${file.name}: ${progress}%`, {
                    id: file.name,
                  });
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
