import { type ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "../sharedBase/globalUtils";
import { useFetchRoleDetailsData } from "../sharedBase/lookupService";
import { Action } from "../types/listpage";
import { RoleDetail } from "../core/model/roledetail";

interface AuthGuardProps {
  children: ReactNode
  requiredAction: string
  page: string
}

const AuthGuard = ({ children, requiredAction, page }: AuthGuardProps) => {
  const location = useLocation();
  const [roleData, setRoleData] = useState<RoleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: roleDetailsData } = useFetchRoleDetailsData();

  useEffect(() => {
    const getRoleData = async () => {
      
      if (roleDetailsData && roleDetailsData.length > 0) {
        const filteredRoleData = roleDetailsData.find((r) => r.name === page.toLowerCase());
        setRoleData(filteredRoleData ?? null);
      }
      setIsLoading(false);
    }

    getRoleData();
  }, [page, roleDetailsData])

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!roleData) {
    return <Navigate to="/404" state={{ from: location }} replace />
  }

  const actions = roleData.action ? JSON.parse(roleData.action) : [];
  const hasPermission = actions.some((action: Action) => action.name.toLowerCase() === requiredAction.toLowerCase());

  return hasPermission ? <>{children}</> : <Navigate to="/404" state={{ from: location }} replace />
}

export default AuthGuard;

