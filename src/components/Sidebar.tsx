import { useAuthStore } from "../store/auth.store";
import { AiFillHome, Button, FiShoppingBag, FiUser, InputText, IoList, IoPersonSharp, RiLogoutCircleLine, RxCross2 } from "../sharedBase/globalImports";
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
  const { t, i18n } = useTranslation();
  const { login, userInfo } = useAuthStore();
  const [roleData, setRoleData] = useState<RoleDetail[] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: roleDetailsData } = useFetchRoleDetailsData();
  const [searchTerm, setSearchTerm] = useState("");

  const menuItems = [
    {
      label: t("globals.homes"),
      path: "/appuser/home",
      icon: <AiFillHome size={18} className={`flex-shrink-0 ${isMinimized ? '' : 'mr-2'}`}/>,
      type: "navigate"
    },
    {
      label: t("globals.list"),
      path: "/appuser/grid",
      icon: <IoList size={18} className={`flex-shrink-0 ${isMinimized ? '' : 'mr-2'}`}/>,
      type: "navigate"
    },
    {
      label: t("appUserTests.form_detail.fields.modelname"),
      path: "/appUserTests",
      icon: <FiUser size={18} className={`flex-shrink-0 ${isMinimized ? '' : 'mr-2'}`}/>,
      type: "handleNavigation",
      accessName: "AppUserTest",
      requires: { role: "appusertest", action: "List" }
    },
    {
      label: `${t("appUserTests.form_detail.fields.modelname")} ${t("globals.list")}`,
      path: "/appUserTests/grid",
      icon: <IoList size={18} className={`flex-shrink-0 ${isMinimized ? '' : 'mr-2'}`}/>,
      type: "navigate"
    },
    {
      label: t("products.form_detail.fields.modelname"),
      path: "/product",
      icon: <FiShoppingBag size={18} className={`flex-shrink-0 ${isMinimized ? '' : 'mr-2'}`}/>,
      type: "handleNavigation",
      accessName: "Product",
      requires: { role: "product", action: "List" }
    },
    {
      label: t("categories.form_detail.fields.modelname"),
      path: "/categories",
      icon: <FiUser size={18} className={`flex-shrink-0 ${isMinimized ? '' : 'mr-2'}`}/>,
      type: "navigate"
    },
    {
      label: t("appUsers.columns.fields.role"),
      path: "/role",
      icon: <IoPersonSharp size={18} className={`flex-shrink-0 ${isMinimized ? '' : 'mr-2'}`}/>,
      type: "navigate"
    }
  ];

  const visibleMenuItems = menuItems.filter((item) => {
    const label = item.label?.toLocaleLowerCase(i18n.language);
    const query = searchTerm?.toLocaleLowerCase(i18n.language);
    return label.includes(query);
  });

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
    <> {isSidebarOpen && (
      <div
        className="fixed inset-0 bg-black/30 z-40 md:hidden"
        onClick={toggleSidebar}
      />
    )}

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

        {!isMinimized && (
          <div className="p-2">
            <InputText
              type="search"
              placeholder={t("globals.globalSearch")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] text-xs rounded-md pl-2 lg:py-2 py-1"
            />
          </div>
        )}

        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden p-2 lg:p-3 space-y-2 bg-[var(--color-primary)] text-[var(--color-white)] `}
        >
          {visibleMenuItems.map((item) => {
            if (item.requires) {
              const roleObj = roleData?.find(
                (r: any) => r.name?.toLowerCase() === item.requires!.role.toLowerCase()
              );
              if (!hasAccess(roleObj, item.requires.action)) return null;
            }

            const isActive = location.pathname.startsWith(item.path);

            const onClick = () => {
              if (item.type === "handleNavigation") {
                handleNavigation(item.path, item.accessName || item.label);
              } else {
                navigate(item.path);
                if (!isMinimized) toggleSidebar();
              }
            };

            return (
              <Button
                key={item.path}
                onClick={onClick}
                className={`w-full flex items-center justify-start ${isMinimized ? "px-1" : "px-2"} py-2 rounded
                ${isActive ? "bg-[var(--color-white)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-white)]"}
                hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]`}
                tooltip={isMinimized ? item.label : undefined}
                tooltipOptions={{ position: "right", className: "font-normal rounded text-xs" }}
              >
                {item.icon}
                {!isMinimized && (
                  <span className="text-xs font-medium text-left truncate ml-2">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>

        <footer className="flex items-center p-2 lg:px-3 border-t bg-[var(--color-primary)] text-[var(--color-white)] ">
          <Button
            onClick={handleLogout}
            className={`w-full flex items-center justify-start ${isMinimized ? "px-1 " : "px-2"} py-2 rounded  
            bg-[var(--color-primary)] text-[var(--color-white)] hover:bg-[var(--color-white)] hover:text-[var(--color-primary)] `}
            tooltip={isMinimized ? t("globals.logout") : undefined}
            tooltipOptions={{
              position: 'right',
              className: 'font-normal rounded text-xs'
            }}
          >
            <RiLogoutCircleLine size={18} className={` flex-shrink-0 ${isMinimized ? '' : 'mr-3'}`} />
            {(!isMinimized) && <span className="text-xs font-medium text-left truncate">{t("globals.logout")}</span>}
          </Button>
        </footer>
      </aside>
    </>
  );
};

export default Sidebar;
