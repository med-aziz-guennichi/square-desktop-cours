import { BaseModel } from './base.model.interface';
import { IUser } from './user.interface';

export interface Subject extends BaseModel {
  subject: {
    _id: string;
    name: string;
    description?: string;
  };
  instructor: IUser;
}
