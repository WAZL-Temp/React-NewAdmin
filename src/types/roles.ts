export interface Action {
    name: string;
    value: string;
  }
  
  export interface HideColumn {
    name: string;
    value: string;
  }
  
  export interface Status {
    name: string;
    label: string;
    value: string;
  }
  
  export interface RolePermission {
    id: number;
    name: string;
    roleId: number;
    roleName: string;
    action: Action[];
    hideColumn: HideColumn[];
    status: Status[];
    dbStatus: { [key: string]: string };
  }
  
