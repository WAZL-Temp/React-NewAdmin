export type FileData = {
    fileName: string;
};

export type RowData = {
    [key: string]: string | FileData | FileData[] | undefined;
};

export type ColumnConfig = {
    field: string;
    header: string;
    isDefault?: boolean;
    show?: boolean;
};

export type RoleData = {
    hideColumn?: string;
    action?: string;
    name: string;
    dbStatus?: string;
};

export interface Action {
    name: string;
}

export type SortOrder = 1 | 0 | -1 | undefined;

export interface FileInfo {
    fileName: string;
    filePath: string;
}

export interface ConditionParams {
    [key: string]: any;
}

export interface RoleConditionParams {
    [key: string]: any;
}

export interface SearchParams {
    [key: string]: any;
}

export interface TableSearchParams {
    sortField: string;
    sortOrder: string | number;
    first: number;
    rows: number;
    filter: string;
    top: string;
    left: string;
    searchRowFilter: { [key: string]: any };
  }

export interface CachedState {
    search: SearchParams;
    tableSearch: TableSearchParams;
    condition: ConditionParams;
    roleCondition: RoleConditionParams;
}