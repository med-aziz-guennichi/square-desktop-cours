import { BaseModel } from './base.model.interface';
import { IUser } from './user.interface';

export interface Permission extends BaseModel {
  read?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  import?: boolean;
  export?: boolean;
}

export interface Rules extends BaseModel {
  user?: IUser;
  gestionProjet?: Permission;
  finance?: Permission;
  gestionCharge?: Permission;
  devis?: Permission;
  facture?: Permission;
  inscription?: Permission;
  parametre?: Permission;
  utilisateur?: Permission;
  collaborateur?: Permission;
  instructor?: Permission;
  responsable?: Permission;
  students?: Permission;
  events?: Permission;
  plansDeEtude?: Permission;
  classe?: Permission;
}
