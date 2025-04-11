import { BaseModel } from './base.model.interface';
import { Period } from './periode.interface';
import { IUser } from './user.interface';

export interface SubjectsInstructor {
  subject: string;
  instructor: IUser;
  blockedStudents?: string[];
}
export interface Class extends BaseModel {
  name?: string;
  capacity?: number;
  groupNumber?: number;
  // educationalPath?: EducationalPath;
  period?: Period;
  students?: IUser[];
  // sousPeriodes?: SubPeriodesClass[];
  subjectsInstructors?: SubjectsInstructor[];
}
