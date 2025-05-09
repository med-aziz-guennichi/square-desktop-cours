import { Quiz } from '@/components/form/Quiz/quizParametre';
import { BaseModel } from './base.model.interface';
import { IUser } from './user.interface';

export interface Cours extends BaseModel {
  title: string;
  description: string;
  creator: IUser;
  isLocked: boolean;
  chapters: Chapters[];
}

export interface Chapters extends BaseModel {
  title: string;
  description: string;
  userProgress?: {
    isCompleted: boolean;
    progress: number;
  }[];
  typeDocument: string;
  quizzes: Quiz[];
  type: string;
  studyMaterials: StudyMaterials[];
}

export interface StudyMaterials {
  displayName: string;
  fileName: string;
}

export interface Progress {
  chapterId: string;
  userId: string;
  isComplete: boolean;
}
