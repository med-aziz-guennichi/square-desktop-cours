// ---------- ENUMS ----------

import { BaseModel } from './base.model.interface';
import { Class } from './classe.interface';
import { Facility } from './facility.interface';
import { Gender } from './gender.interface';
import { ResponsableFroChild, ResponsableType } from './responsable.type.interface';
import { Rules } from './rules.interface';

export enum UserRole {
  SuperAdmin = 'super-admin',
  CompanyAdmin = 'company-admin',
  Collaborator = 'utilisateur',
  Commercial = 'commercial',
  Instructor = 'instructor',
  Responsible = 'responsable',
  Student = 'student',
  Admin = 'admin', // Deprecated
  Editor = 'editor', // Deprecated
}
export interface IUser extends BaseModel {
  // User information
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: Gender;
  birthdate?: Date;
  birthPlace?: string;
  phoneNumber?: string;
  passport?: string;
  website?: string;
  secondaryPhoneNumber?: string;
  zipCode?: string;
  occupation?: string;
  cnssNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  bank?: string;
  rib?: string;
  enterprise?: string;
  barcode?: string;
  uniqueNumber?: number;
  description?: string;

  // Scholarship information
  classValue?: Class;
  facility?: Facility;
  ownedFacilities?: Facility[];

  // Instructor
  classes?: Class[];

  // Relations
  responsibleFor?: IUser[];

  // Other information
  imageUrl?: string;
  files?: string[];
  role?: UserRole;
  fcmToken?: string;

  // Permission user
  rule?: Rules;

  // Responsable
  responsableFor?: string[];
  responsableType?: ResponsableType;
  responsable?: IUser;
  responsableFroChild?: ResponsableFroChild;
}
