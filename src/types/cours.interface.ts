import { BaseModel } from './base.model.interface';
import { IUser } from './user.interface';

export interface Cours extends BaseModel {
  title: string;
  description: string;
  instructorId: IUser;
}
