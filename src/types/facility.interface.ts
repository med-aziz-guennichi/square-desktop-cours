import { BaseModel } from './base.model.interface';

export enum FacilityType {
  University = 'university',
  TrainingCenter = 'trainingCenter',
  HighSchool = 'highSchool',
  MiddleSchool = 'middleSchool',
}

export interface Facility extends BaseModel {
  name: string;
  taxNumber?: string;
  entreprise?: string;
  type: FacilityType;
  scholarityConfigId: string;

  // Derived helper booleans (optional)
  isFaculty?: boolean;
  isTrainingCenter?: boolean;
  isHighSchool?: boolean;
  isMiddleSchool?: boolean;
}
