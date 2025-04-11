import { BaseModel } from './base.model.interface';
import { Facility } from './facility.interface';
import { IUser } from './user.interface';

export enum ResponsableType {
  B2B = 'B2B',
  B2C = 'B2C',
}
export interface ResponsableFroChild extends BaseModel {
  child?: IUser;
  facility?: Facility;
}
