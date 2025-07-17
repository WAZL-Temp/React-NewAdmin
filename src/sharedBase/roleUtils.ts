import { RoleDetail } from "../core/model/roledetail";
import { Action } from "../types/listpage";

export function hasPageAccess(roleData: RoleDetail[] | null, pageName: string, actionName: string = "List"): boolean {
  if (!roleData || !Array.isArray(roleData)) return false;

  const pageRole = roleData.find(
    (r) => typeof r.name === "string" && r.name.toLowerCase() == pageName.toLowerCase()
  );
  
  if (!pageRole) return false;

  const actions: Action[] = typeof pageRole.action === "string" ? JSON.parse(pageRole.action) : [];
  const action = actions.some((action: Action) => action.name.toLowerCase() == actionName.toLowerCase());  
  return action
}
