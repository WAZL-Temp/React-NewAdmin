import { useAuthStore } from "../store/auth.store";
import { AiFillHome, Button, FiShoppingBag, FiUser, IoList, IoPersonSharp, RiLogoutCircleLine, RxCross2 } from "../sharedBase/globalImports";
import { useLocation, useNavigate, useTranslation } from '../sharedBase/globalUtils';
import { UserInfo } from "../types/auth";
import { useFetchRoleDetailsData } from "../sharedBase/lookupService";
import { useEffect, useState } from "react";
import { Action } from "../types/listpage";
import { RoleDetail } from "../core/model/roledetail";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMinimized: boolean;
  toggleMinimized: () => void;
}

const Sidebar = ({ isSidebarOpen, toggleSidebar, isMinimized }: SidebarProps) => {
  const { t } = useTranslation();
  const { login, userInfo } = useAuthStore();
  const [roleData, setRoleData] = useState<RoleDetail[] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: roleDetailsData } = useFetchRoleDetailsData();

  useEffect(() => {
    if (roleDetailsData && Array.isArray(roleDetailsData)) {
      const parsedData = roleDetailsData.map((item: RoleDetail) => ({
        ...item,
        action: item.action ? JSON.parse(item.action) : [],
        hideColumn: item.hideColumn ? JSON.parse(item.hideColumn) : [],
        status: item.status ? JSON.parse(item.status) : [],
        dbStatus: item.dbStatus ? JSON.parse(item.dbStatus) : {},
      }));

      setRoleData(parsedData);
    }
  }, [roleDetailsData]);

  useEffect(() => {
    if (isMinimized) {
      document.body.classList.add("sidebar-collapsed");
      document.body.classList.remove("sidebar-expanded");
    } else {
      document.body.classList.add("sidebar-expanded");
      document.body.classList.remove("sidebar-collapsed");
    }
  }, [isMinimized]);

  const hasAccess = (roleData: any, requiredAction: string) => {
    if (!roleData) return false;

    const actions = roleData?.action;
    let newAction = false;

    if (actions.length) {
      newAction = actions?.some((action: Action) => action.name.toLowerCase() === requiredAction.toLowerCase());
    }
    return newAction;
  }

  const handleLogout = () => {
    login("");
    userInfo(null as unknown as UserInfo);
    window.location.href = "/";
    toggleSidebar();
  };

  const hasAccessToPage = (actionName: string) => {
    return roleData?.some((action: any) => action.name.toLowerCase() === actionName.toLowerCase()) ?? false;
  }

  const handleNavigation = (path: string, actionName: string) => {
    if (hasAccessToPage(actionName)) {
      navigate(path);
    } else {
      navigate("/404");
    }
    if (!isMinimized) {
      toggleSidebar();
    }
  }

  return (
    <aside
      className={`flex-shrink-0 fixed inset-y-0 left-0 z-50 sidebar bg-[var(--color-primary)] text-[var(--color-white)] border border-muted/40 transform transition-transform duration-300 ease-in-out 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
       md:relative md:translate-x-0
      ${isMinimized ? "w-16" : "w-[170px]"} flex flex-col justify-between h-full`}
    >

      <div className="bg-[var(--color-primary)] sidebar md:hidden lg:hidden mb-14">
        <button
          className="absolute top-4 right-4 text-[var(--color-primary)] bg-[var(--color-white)] p-1 rounded-md"
          onClick={toggleSidebar}
        >
          <RxCross2 size={20} />
        </button>
      </div>

      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden p-2 lg:p-3 space-y-2 bg-[var(--color-primary)] text-[var(--color-white)] `}
      >
        <Button
          onClick={() => {
            navigate("/appuser/home");
            if (!isMinimized) toggleSidebar();
          }}
          className={`flex items-center ${isMinimized ? 'px-1' : 'px-2'} py-2 rounded
          ${location.pathname === "/appuser/home" ? "bg-[var(--color-white)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-white)]"}
          hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]`}
          tooltip={t("globals.homes")}
          tooltipOptions={{
            position: 'right',
            className: 'font-normal rounded text-xs'
          }}
        >
          <AiFillHome size={18} className={`${isMinimized ? '' : 'mr-3'}`} />
          {(!isMinimized) && <span className=" text-xs font-medium">{t("globals.homes")}</span>}
        </Button>

        <Button
          onClick={() => {
            navigate("/appuser/grid");
            if (!isMinimized) toggleSidebar();
          }}
          className={`flex items-center ${isMinimized ? 'px-1' : 'px-2'} py-2 rounded
          ${location.pathname === "/appuser/grid" ? "bg-[var(--color-white)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-white)]"}
          hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]`}
          tooltip={t("appUsers.form_detail.fields.modelname") + " " + t("globals.list")}
          tooltipOptions={{
            position: 'right',
            className: 'font-normal rounded text-xs'
          }}
        >
          <IoList size={18} className={`${isMinimized ? '' : 'mr-3'}`} />
          {(!isMinimized) && <span className=" text-xs font-medium">{t("globals.list")}</span>}
        </Button>

        {roleData && hasAccess(roleData.find((r: any) => r.name.toLowerCase() == 'appusertest'), "List") && (
          <Button
            // onClick={() => {
            //   navigate("/appUserTests");
            //   if (!isMinimized) toggleSidebar();
            // }}
            onClick={() => handleNavigation("/appUserTests", "AppUserTest")}
            className={`flex items-center ${isMinimized ? 'px-1' : 'px-2'} py-2 rounded
              ${location.pathname === "/appUserTests" ? "bg-[var(--color-white)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-white)]"}
              hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]`}
            tooltip={t("appUserTests.form_detail.fields.modelname")}
            tooltipOptions={{
              position: 'right',
              className: 'font-normal rounded text-xs'
            }}
          >
            <FiUser size={18} className={`${isMinimized ? '' : 'mr-3'}`} />
            {(!isMinimized) && <span className=" text-xs font-medium">
              {t("appUserTests.form_detail.fields.modelname")}</span>}
          </Button>
        )}

        <Button
          onClick={() => {
            navigate("/appUserTests/grid");
            if (!isMinimized) toggleSidebar();
          }}
          className={`flex items-center ${isMinimized ? 'px-1' : 'px-2'} py-2 rounded
          ${location.pathname === "/appUserTests/grid" ? "bg-[var(--color-white)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-white)]"}
          hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]`}
          tooltip={t("appUserTests.form_detail.fields.modelname") + " " + t("globals.list")}
          tooltipOptions={{
            position: 'right',
            className: 'font-normal rounded text-xs'
          }}
        >
          <IoList size={18} className={`${isMinimized ? '' : 'mr-3'}`} />
          {(!isMinimized) && <span className=" text-xs font-medium">
            {t("appUserTests.form_detail.fields.modelname")}
            {t("globals.list")}
          </span>}
        </Button>

        {roleData && hasAccess(roleData.find((r: any) => r.name.toLowerCase() === 'product'), "List") && (
          <Button
            onClick={() => handleNavigation("/product", "Product")}
            // onClick={() => {
            //   navigate("/product");
            //   if (!isMinimized) toggleSidebar();
            // }}
            className={`flex items-center ${isMinimized ? 'px-1' : 'px-2'} py-2 rounded
            ${location.pathname === "/product" ? "bg-[var(--color-white)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-white)]"}
            hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]`}
            tooltip={t("products.form_detail.fields.modelname")}
            tooltipOptions={{
              position: 'right',
              className: 'font-normal rounded text-xs'
            }}
          >
            <FiShoppingBag size={18} className={`${isMinimized ? '' : 'mr-3'}`} />
            {(!isMinimized) && <span className=" text-xs font-medium">
              {t("products.form_detail.fields.modelname")}
            </span>}
          </Button>
        )}

        <Button
          onClick={() => {
            navigate("/categories");
            if (!isMinimized) toggleSidebar();
          }}
          className={`flex items-center ${isMinimized ? 'px-1' : 'px-2'} py-2 rounded
          ${location.pathname === "/categories" ? "bg-[var(--color-white)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-white)]"}
          hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]`}
          tooltip={t("categories.form_detail.fields.modelname")}
          tooltipOptions={{
            position: 'right',
            className: 'font-normal rounded text-xs'
          }}
        >
          <FiUser size={18} className={`${isMinimized ? '' : 'mr-3'}`} />
          {(!isMinimized) && <span className=" text-xs font-medium">
            {t("categories.form_detail.fields.modelname")}
          </span>}
        </Button>

        <Button
          onClick={() => {
            navigate("/role");
            if (!isMinimized) toggleSidebar();
          }}
          className={`flex items-center ${isMinimized ? 'px-1' : 'px-2'} py-2 rounded
          ${location.pathname === "/role" ? "bg-[var(--color-white)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-white)]"}
          hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]`}
          tooltip={t("appUsers.columns.fields.role")}
          tooltipOptions={{
            position: 'right',
            className: 'font-normal rounded text-xs'
          }}
        >
          <IoPersonSharp size={18} className={`${isMinimized ? '' : 'mr-3'}`} />
          {(!isMinimized) && <span className=" text-xs font-medium">{t("appUsers.columns.fields.role")}</span>}
        </Button>
      </nav>

      <footer className="flex justify-center items-center p-2 border-t bg-[var(--color-primary)] text-[var(--color-white)] ">
        <Button
          onClick={handleLogout}
          className={`flex items-center justify-center py-2 rounded ${isMinimized ? "px-1 " : "px-2"} bg-[var(--color-primary)] text-[var(--color-white)] 
         hover:bg-[var(--color-white)] hover:text-[var(--color-primary)] ${isMinimized && !isSidebarOpen ? "justify-center" : ""}`}
        >
          <RiLogoutCircleLine size={18} className={`${isMinimized ? '' : 'mr-3'}`} />
          {(!isMinimized) && <span className="text-xs font-medium">{t("globals.logout")}</span>}
        </Button>
      </footer>
    </aside >
  );
};

export default Sidebar;
