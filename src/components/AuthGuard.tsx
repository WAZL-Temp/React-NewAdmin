import { type ReactNode, useEffect, useState } from "react";
import { LookupServiceBase } from "../sharedBase/lookupService";
import { Navigate, useLocation } from "../sharedBase/globalImports";

interface AuthGuardProps {
  children: ReactNode
  requiredAction: string
  page: string
}

const AuthGuard = ({ children, requiredAction, page }: AuthGuardProps) => {
  const location = useLocation();
  const [roleData, setRoleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRoleData = async () => {
      const lookupService = new LookupServiceBase();
      const roleDetails = await lookupService.fetchRoleDetailsData();
      if (Array.isArray(roleDetails)) {
        const filteredRoleData = roleDetails.find((r) => r.name.toLowerCase() === page.toLowerCase());
        setRoleData(filteredRoleData);
      }
      setIsLoading(false);
    }

    getRoleData();
  }, [page])

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!roleData) {
    return <Navigate to="/404" state={{ from: location }} replace />
  }

  const actions = roleData.action ? JSON.parse(roleData.action) : [];
  const hasPermission = actions.some((action: any) => action.name.toLowerCase() === requiredAction.toLowerCase());

  return hasPermission ? <>{children}</> : <Navigate to="/404" state={{ from: location }} replace />
}

export default AuthGuard;

