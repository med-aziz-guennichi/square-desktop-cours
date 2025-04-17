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
import { instance } from '@/lib/axios';
import axios from 'axios';
import { Upload, X } from 'lucide-react';
import * as React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface FileUploadCircularProgressDemoProps {
    maxFiles: number;
    form: UseFormReturn<FieldValues, object, FieldValues>;
    index: number;
    accept: string;
}

interface StudyMaterial {
    fileName: string;
    displayName: string;
}

const CHUNK_SIZE = 1024 * 1024 * 20; // 20 MB

export function FileUploadCircularProgressDemo({
    maxFiles,
    form,
    index,
    accept,
}: FileUploadCircularProgressDemoProps) {
    const [files, setFiles] = React.useState<File[]>(() => {
        const initialFiles = form.getValues(`chapters.${index}.files`);
        return initialFiles ? [...initialFiles] : [];
    });

    React.useEffect(() => {
        const subscription = form.watch((values, { name }) => {
            if (name === `chapters.${index}.files`) {
                const watchedFiles = values.chapters?.[index]?.files ?? [];
                setFiles(prevFiles => {
                    // Compare based on file names and sizes
                    const prevFilesStr = prevFiles.map(f => `${f.name}-${f.size}`).join(',');
                    const newFilesStr = watchedFiles.map((f: File) => `${f.name}-${f.size}`).join(',');
                    if (prevFilesStr !== newFilesStr) {
                        return watchedFiles;
                    }
                    return prevFiles;
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [form, index]);

    const uploadFileInChunks = async (
        file: File,
        onProgress: (file: File, progress: number) => void,
        signal?: AbortSignal,
    ): Promise<string> => {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const fileExtension = file.name.split('.').pop();
        let filename: string | null = null;

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunkBlob = file.slice(start, end);
            const chunkFile = new File([chunkBlob], `chunk.${fileExtension}`, {
                type: file.type,
            });

            let uploadSuccess = false;
            let retryCount = 0;
            const maxRetries = 3;

            while (!uploadSuccess && retryCount < maxRetries) {
                try {
                    const formData = new FormData();
                    formData.append('folder', 'lesson');
                    formData.append('chunkIndex', chunkIndex.toString());
                    formData.append('chunkCount', totalChunks.toString());
                    formData.append('filename', filename ?? '');
                    formData.append('chunk', chunkFile);

                    if (chunkIndex === 0) {
                        const res = await instance.post(
                            '/file-manager/create-initial-chunk',
                            formData,
                            { signal },
                        );
                        filename = res.data?.data?.filename;
                        if (!filename) throw new Error('Filename not returned by server.');
                    } else {
                        if (!filename) {
                            throw new Error('Filename missing before continuing upload.');
                        }
                        await instance.post('/file-manager/upload-chunk', formData, {
                            headers: { 'Content-Type': 'application/octet-stream' },
                            signal,
                        });
                    }

                    // Update progress after each successful chunk upload
                    const progress = ((chunkIndex + 1) / totalChunks) * 100;
                    onProgress(file, progress);
                    uploadSuccess = true;
                } catch (err) {
                    if (axios.isCancel(err)) {
                        return Promise.reject(new Error('Upload canceled'));
                    }

                    retryCount++;
                    if (retryCount >= maxRetries) {
                        throw err instanceof Error ? err : new Error('Upload failed after retries');
                    }

                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }
        }

        if (!filename) {
            throw new Error('Filename not available for finalization');
        }

        const finalize = await instance.post(
            '/file-manager/combine-chunks',
            { folder: 'lesson', filename, chunkCount: totalChunks },
            { signal },
        );

        if (finalize.status !== 200) {
            throw new Error('Failed to finalize chunked upload');
        }

        return filename;
    };

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
        const controller = new AbortController();
    
        try {
          await Promise.all(
            newFiles.map(async (file) => {
    
              try {
                // Show toast for progress
                toast.promise(
                  new Promise((resolve, reject) => {
                      const handleUpload = async () => {
                          try {
                              const filename = await uploadFileInChunks(
                                  file,
                                  (f, progress) => {
                                      onProgress(f, progress); // still call original handler
                                      toast.loading(`Uploading ${file.name}: ${progress}%`, {
                                          id: file.name,
                                      });
                                  },
                                  controller.signal,
                              );

                              const currentStudyMaterials: StudyMaterial[] =
                                  form.getValues(`chapters.${index}.studyMaterials`) ?? [];

                              
                              form.setValue(`chapters.${index}.studyMaterials`, [
                                  ...currentStudyMaterials,
                                  {
                                      fileName: filename,
                                      displayName: file.name,
                                  },
                              ]);

                              onSuccess(file); // still call original handler
                              resolve(file);
                          } catch (err) {
                              const error = err instanceof Error ? err : new Error('Unknown upload error');
                              onError(file, error); // still call original handler
                              reject(error);
                          }
                      };

                      handleUpload();
                  }),
                  {
                    loading: `Uploading ${file.name}...`,
                    success: `${file.name} uploaded successfully`,
                    error: (error) => `${file.name} failed to upload: ${error.message}`,
                    id: file.name,
                  },
                );
              } catch (err) {
                console.error('Inner upload error:', err);
              }
            }),
          );
        } catch (err) {
          console.error('Upload error:', err);
        }
      },
      [form, index],
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
                            <FileUploadItem key={`${file.name}-${file.size}-${i}`} value={file} className="p-0">
                                <FileUploadItemPreview className="size-15" />
                                <FileUploadItemMetadata className="sr-only" />
                                <FileUploadItemDelete asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
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
