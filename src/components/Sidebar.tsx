"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAppUserTabStore } from "../store/useAppUserTabStore"
import { useTranslation } from "../sharedBase/globalUtils"
import { UserInfo } from "../types/auth";
import { useAuthStore } from "../store/auth.store"
import { AiFillHome, BiCategory, Button, FiUser, InputText, IoList, IoPersonSharp, MdGridView, IoIosArrowDown, RiLogoutCircleLine, RxCross2, Toast, FaUserSlash, FaUserCheck, FaUserTimes } from "../sharedBase/globalImports"
import { useFetchDashboardInfoData } from "../sharedBase/lookupService"

type SidebarProps = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  isMinimized: boolean
  toggleMinimized: (next?: boolean) => void
  currentPath?: string
  onNavigate?: (path: string) => void
  canAccess?: (key: string) => boolean
  translate?: (key: string) => string
}

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ")

type TabType = "active" | "inactive" | "isDelete"
type SubItem = {
  label: string
  to: string
  icon: React.ReactNode
  accessKey: string
  activeWhen: (p: string) => boolean
  tabType?: TabType
  count?: number
}
type MenuSection = {
  key: string
  label: string
  icon: React.ReactNode
  to?: string
  accessKey?: string
  count?: number
  showToastOnMinimized?: boolean
  isOpenWhen?: (p: string) => boolean
  items?: SubItem[]
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
  isMinimized,
  toggleMinimized,
  currentPath,
  onNavigate,
  canAccess,
}: SidebarProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("")
  const [openSection, setOpenSection] = useState<string | null>(null)
  const toast = useRef<Toast>(null)
  const { setTab } = useAppUserTabStore();
  const { login, userInfo } = useAuthStore();
  const { data: dashboardInfoData } = useFetchDashboardInfoData();


  const path = useMemo(
    () => currentPath || (typeof window !== "undefined" ? window.location.pathname : "/"),
    [currentPath],
  )

  const can = (key?: string) => (key ? (canAccess ? canAccess(key) : true) : true)
  const filtered = (label: string) => label.toLowerCase().includes(searchTerm.toLowerCase())

  const sectionClass =
    "text-[var(--color-white)] hover:bg-[var(--color-white)/20] hover:text-[var(--color-white)] transition-colors"

  const menuConfig: MenuSection[] = [
    {
      key: "appUser",
      label: t("appUsers.form_detail.fields.modelname"),
      icon: <FiUser size={18} className="flex-shrink-0" />,
      count: 1880,
      showToastOnMinimized: false,
      isOpenWhen: (p) => p.startsWith("/appuser"),
      items: [
        {
          label: t("globals.homes"),
          to: "/appuser/home",
          icon: <AiFillHome size={14} />,
          accessKey: "appuser:home",
          activeWhen: (p) => p === "/appuser/home",
        },
        {
          label: t("globals.list"),
          to: "/appuser",
          icon: <IoList size={14} />,
          accessKey: "appuser:list",
          activeWhen: (p) => p === "/appuser",
        },
        {
          label: t("globals.grid"),
          to: "/appuser/grid",
          icon: <MdGridView size={14} />,
          accessKey: "appuser:grid",
          activeWhen: (p) => p === "/appuser/grid",
        },
        {
          label: "Active Users",
          to: "/appuser?tab=active",
          icon: <FaUserCheck size={14} />,
          accessKey: "appuser:list",
          activeWhen: (p) => p === "/appuser?tab=active",
          tabType: "active",
          count: dashboardInfoData.appUser?.[0]?.activeCount ?? 0,
        },
        {
          label: "Inactive Users",
          to: "/appuser?tab=inactive",
          icon: <FaUserSlash size={14} />,
          accessKey: "appuser:list",
          activeWhen: (p) => p === "/appuser?tab=inactive",
          tabType: "inactive",
          count: dashboardInfoData.appUser?.[0]?.inactiveCount ?? 0,
        },
        {
          label: "Delete Users",
          to: "/appuser?tab=isDelete",
          icon: <FaUserTimes size={14} />,
          accessKey: "appuser:list",
          activeWhen: (p) => p === "/appuser?tab=isDelete",
          tabType: "isDelete",
          count: dashboardInfoData.appUser?.[0]?.deletedCount ?? 0,
        },
      ],
    },
    {
      key: "appUserTest",
      label: t("appUserTests.form_detail.fields.modelname"),
      icon: <FiUser size={18} className="flex-shrink-0" />,
      count: 544,
      showToastOnMinimized: false,
      isOpenWhen: (p) => p.startsWith("/appUserTests"),
      items: [
        {
          label: t("globals.homes"),
          to: "/appUserTests/home",
          icon: <AiFillHome size={14} />,
          accessKey: "appUserTests:home",
          activeWhen: (p) => p === "/appUserTests/home",
        },
        {
          label: t("globals.list"),
          to: "/appUserTests",
          icon: <IoList size={14} />,
          accessKey: "appUserTests:list",
          activeWhen: (p) => p === "/appUserTests",
        },
        {
          label: t("globals.grid"),
          to: "/appUserTests/grid",
          icon: <MdGridView size={14} />,
          accessKey: "appUserTests:grid",
          activeWhen: (p) => p === "/appUserTests/grid",
        },
      ],
    },
    {
      key: "category",
      label: t("categories.form_detail.fields.modelname"),
      icon: <BiCategory size={18} className="flex-shrink-0" />,
      count: 84,
      showToastOnMinimized: false,
      isOpenWhen: (p) => p.startsWith("/category") || p.startsWith("/categories"),
      items: [
        {
          label: t("globals.homes"),
          to: "/category/home",
          icon: <AiFillHome size={14} />,
          accessKey: "category:home",
          activeWhen: (p) => p === "/category/home",
        },
        {
          label: t("globals.list"),
          to: "/category/list",
          icon: <IoList size={14} />,
          accessKey: "category:list",
          activeWhen: (p) => p === "/category/list",
        },
        {
          label: t("globals.grid"),
          to: "/category/grid",
          icon: <MdGridView size={14} />,
          accessKey: "category:grid",
          activeWhen: (p) => p === "/category/grid",
        },
      ],
    },
    {
      key: "role",
      label: t("appUsers.columns.fields.role"),
      icon: <IoPersonSharp size={16} className="flex-shrink-0" />,
      to: "/role",
      accessKey: "role:open",
    },
  ]

  useEffect(() => {
    if (isMinimized) return
    const match =
      menuConfig.find((s) => (s.isOpenWhen ? s.isOpenWhen(path) : false)) ||
      menuConfig.find((s) => s.items?.some((it) => it.activeWhen(path)))
    setOpenSection(match ? match.key : null)
  }, [path, isMinimized]) // eslint-disable-line react-hooks/exhaustive-deps

  const navigateTo = (to: string) => {
    if (onNavigate) onNavigate(to);
    if (!isMinimized) toggleSidebar();
  }

  const handleOpenFromMinimized = (sectionKey: string, showCountToast: boolean, label?: string, count?: number) => {
    if (isMinimized) {
      toggleMinimized(false)
      setTimeout(() => setOpenSection(sectionKey), 150)
      if (showCountToast && typeof count === "number" && label) {
        toast.current?.show({
          severity: "info",
          summary: `${label} Count`,
          detail: `${count}`,
          life: 2000,
          className: "bg-[var(--color-white)] text-[var(--color-primary)] text-xs rounded",
        })
      }
    } else {
      setOpenSection((prev) => (prev === sectionKey ? null : sectionKey))
    }
  }

  const renderSubItem = (item: SubItem) => {
    const { label, to, icon, accessKey, tabType, activeWhen, count } = item
    if (!can(accessKey) || !filtered(label)) return null
    const active = activeWhen(path);

    return (
      <Button
        key={`${label}-${to}`}
        onClick={() => {
          if (tabType) {
            setTab(tabType);
          }
          navigateTo(to)
        }}
        className={cx(
          "w-full flex items-center justify-between gap-2 rounded px-2 py-2 text-xs font-medium transition-all duration-200 shadow-none",
          active
            ? "bg-[var(--color-white)] text-[var(--color-primary)]"
            : "text-[var(--color-white)] hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]"
        )}
      >
        <div className="flex items-start text-left gap-2">
          {icon}
          {!isMinimized && <span>{label}</span>}
        </div>
        {count !== undefined && (
          <span
            className={cx(
              "ml-auto flex items-center justify-center text-[8px] font-bold rounded-full min-w-[22px] h-[22px]",
              active
                ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                : "bg-[var(--color-white)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-white)]"
            )}
          >
            {count}
          </span>
        )}
      </Button>
    )
  }

  const handleLogout = () => {
    login("");
    userInfo(null as unknown as UserInfo);
    window.location.href = "/";
    toggleSidebar();
  }

  return (
    <>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={toggleSidebar} />}

      <aside
        className={`flex-shrink-0 fixed inset-y-0 left-0 z-50 sidebar bg-[var(--color-primary)] text-[var(--color-white)] border border-muted/40 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0
        ${isMinimized ? "w-20" : "w-[200px]"} flex flex-col justify-between h-full overflow-hidden group`}
      >
        <div className="bg-[var(--color-primary)] sidebar md:hidden lg:hidden mb-14 md:mb-0 lg:mb-0">
          <button
            className="absolute top-4 right-4 text-[var(--color-primary)] bg-[var(--color-white)] p-2 rounded-md"
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full text-[var(--color-dark)] bg-[var(--color-white)] border border-[var(--color-border)] text-xs rounded-md pl-2 py-2"
            />
          </div>
        )}

        <Toast ref={toast} position="top-center" />

        <nav
          className={cx(
            "flex-1 overflow-y-auto px-2 space-y-2 sidebar-scroll transition-all duration-300",
            isMinimized ? "pt-5" : "",
          )}
        >
          {menuConfig.map((section) => {
            const showSection = filtered(section.label) && can(section.accessKey)
            if (!showSection) return null
            const isOpen = openSection === section.key
            const hasChildren = (section.items?.length || 0) > 0

            return (
              <div key={section.key} >
                {filtered(section.label ?? (section.items && section.items[0]?.label) ?? "") && (
                  <div className="flex flex-col mt-2 ">
                    <Button
                      onClick={() => {
                        if (section.to && !hasChildren) {
                          navigateTo(section.to)
                          return
                        }
                        handleOpenFromMinimized(section.key, !!section.showToastOnMinimized, section.label, section.count)
                      }}
                      className={cx(
                        "flex w-full px-2 py-2 rounded shadow-none transition-all duration-200 group ",
                        isMinimized
                          ? "flex-col items-center justify-center"
                          : "flex-row items-center justify-start",
                        path === section.to
                          ? "bg-[var(--color-white)] text-[var(--color-primary)]"
                          : "bg-[var(--color-primary)] text-[var(--color-white)] hover:bg-[var(--color-white)] hover:text-[var(--color-primary)]"
                      )}
                      tooltip={isMinimized ? section.label : undefined}
                      tooltipOptions={{ position: "right", className: "font-normal rounded text-xs" }}
                    >
                      <div className={cx("relative inline-flex", isMinimized ? "mt-2" : "mt-0")}>
                        {section.icon}
                        {isMinimized && section.count && (
                          <span
                            className="flex items-center justify-center absolute -top-4 -right-4 bg-[var(--color-white)] text-[var(--color-primary)] text-[8px] px-2 font-bold rounded-full w-[22px] h-[22px] shadow-sm">
                            {section.count}
                          </span>
                        )}
                      </div>

                      {isMinimized ? (
                        <span className="text-[8px] font-medium mt-1 text-center truncate w-[50px]">{section.label}</span>
                      ) : (
                        <div className="flex items-center justify-between w-full ml-2">
                          <span className="text-xs font-medium text-left truncate w-[80px]">{section.label}</span>

                          <div className="flex items-center gap-1 min-w-[45px] justify-end">
                            {section.count && (
                              <span
                                className="flex items-center justify-center bg-[var(--color-white)] text-[var(--color-primary)] text-[8px] font-bold rounded-full w-[22px] h-[22px] shadow-sm transition-all duration-200">
                                {section.count}
                              </span>
                            )}
                            {hasChildren && (
                              <span
                                className={cx(
                                  "text-xs transform transition-transform duration-200",
                                  isOpen ? "rotate-180" : "rotate-0",
                                )}
                                aria-hidden
                              >
                                <IoIosArrowDown size={15} />
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </Button>

                    <div
                      className={cx(
                        "bg-[var(--color-primary-soft)] pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                        !isMinimized && hasChildren
                          ? isOpen
                            ? "max-h-96 opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-2"
                          : "hidden"
                      )}
                    >
                      {section.items?.map((it) => renderSubItem(it))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <footer className="border-t border-[var(--color-border)] p-2">
          <Button
            onClick={handleLogout}
            className={cx(
              "flex items-center w-full px-2 py-2 rounded",
              sectionClass,
              isMinimized ? "flex-col justify-center" : "flex-row justify-start"
            )}
            tooltip={isMinimized ? t("globals.logout") : undefined}
            tooltipOptions={{
              position: 'right',
              className: 'font-normal rounded text-xs'
            }}
          >
            <RiLogoutCircleLine size={16} className="flex-shrink-0 " />
            {!isMinimized && <span className="ml-2 text-xs font-medium text-left">Logout</span>}
          </Button>
        </footer>
      </aside>
    </>
  )
}
