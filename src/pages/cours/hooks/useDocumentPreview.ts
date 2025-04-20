// hooks/useDocumentPreview.ts
import { instance } from '@/lib/axios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export interface DocumentPreviewResponse {
  total: number;
  page: number;
  limit: number;
  images: string[];
}

export function useDocumentPreview(
  enterpriseId: string,
  fileName: string,
  page: number = 1,
  limit: number = 5,
) {
  return useQuery({
    queryKey: ['document-preview', enterpriseId, fileName, page, limit],
    queryFn: async (): Promise<DocumentPreviewResponse> => {
      const { data } = await instance.get<DocumentPreviewResponse>(
        `/file-manager/desktop-preview/${enterpriseId}/${fileName}`,
        { params: { page, limit } },
      );
      return data;
    },
    enabled: !!enterpriseId && !!fileName,
    placeholderData: keepPreviousData, // Smooth transitions between pages
  });
}
