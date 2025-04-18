import { BaseModel } from './base.model.interface';
import { IUser } from './user.interface';

export interface Cours extends BaseModel {
  title: string;
  description: string;
  creator: IUser;
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
  type: string;
  studyMaterials: StudyMaterials[];
}

export interface StudyMaterials {
  displayName: string;
  fileName: string;
}
