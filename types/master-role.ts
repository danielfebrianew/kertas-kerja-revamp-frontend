export interface MasterRoleItem {
  id: number;
  role: string;
}

export interface MasterRoleFindAllResponse {
  code: number;
  status: string;
  data: MasterRoleItem[];
}
