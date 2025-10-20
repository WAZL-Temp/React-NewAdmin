import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../hooks/useTheme';
import { Dropdown, FaBars } from '../sharedBase/globalImports';
import { useLocation, useNavigate, useTranslation } from '../sharedBase/globalUtils';
import { useLanguageStore } from "../store/useLanguage.store";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  const { t, i18n } = useTranslation();
  const { selectedLanguage, setLanguage } = useLanguageStore();
  const languages = [
    { label: t("globals.english"), value: "en" },
    { label: t("globals.hindi"), value: "hi" },
    { label: t("globals.marathi"), value: "mr" },
  ];
  const currentPath = useMemo(() => location.pathname ?? "/", [location.pathname]);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMinimized(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
    localStorage.setItem("app_language", language);
    i18n.changeLanguage(language);
  };

  const showSidebar = location.pathname !== '/';
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--color-white)] text-[var(--color-dark)]">
      <div className="hidden md:block lg:block">
        <Header toggleMinimized={toggleMinimized} />
      </div>

      {showSidebar && (
        <header className="flex h-14 md:hidden lg:hidden items-center justify-between bg-[var(--color-primary)] border-b px-2 w-full">
          <button
            className="text-[var(--color-white)] p-2 rounded-md z-50 relative"
            onClick={toggleSidebar}
          >
            <FaBars size={22} />
          </button>

          <div className="flex items-center gap-1 sm:gap-3 ml-auto pr-2">
            <div className="flex gap-1 sm:gap-2">
              <Dropdown
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.value)}
                options={languages}
                optionLabel="label"
                optionValue="value"
                className="w-28 text-xs font-medium text-[var(--color-primary)]"
              />
            </div>

            <Dropdown
              value={theme}
              options={themes.map((t) => ({ label: t, value: t }))}
              onChange={(e) => setTheme(e.value)}
              className="w-28 text-xs font-medium text-[var(--color-primary)]"
            />

          </div>
        </header>
      )}


      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isMinimized={isMinimized}
            toggleMinimized={toggleMinimized}
            currentPath={currentPath}
            onNavigate={(to) => navigate(to)}
            canAccess={() => true}
          />
        )}
        <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

