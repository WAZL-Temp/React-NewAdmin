import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import img1 from '../assets/images/only-logo.png';
import Header from './Header';
import { useTheme } from '../hooks/useTheme';
import { Button, Dropdown, FaBars, Image } from '../sharedBase/globalImports';
import {useLocation, useTranslation} from '../sharedBase/globalUtils';
import { useLanguageStore } from "../store/useLanguage.store";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  const { i18n } = useTranslation();
  const { selectedLanguage, setLanguage } = useLanguageStore();

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
          <div className="flex items-center">
            <Image src={img1} alt="Logo" className="h-[28px] w-[28px]" />
          </div>

          <div className="flex items-center gap-1 sm:gap-3 ml-auto pr-2">
            <div className="flex gap-1 sm:gap-2">
              {["en", "hi", "mr"].map((lang) => (
                <Button
                  key={lang}
                  className={`w-[50px] sm:w-[58px] h-[32px] sm:h-[36px] text-xs border rounded-lg flex items-center justify-center
                      ${selectedLanguage === lang
                      ? "bg-[var(--color-white)] text-[var(--color-primary)] border-[var(--color-border)]"
                      : "bg-[var(--color-primary)] text-[var(--color-white)] border-[var(--color-white)]"
                    }`}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang === "en" ? "EN" : lang === "hi" ? "HI" : "MR"}
                </Button>
              ))}
            </div>

            <Dropdown
              value={theme}
              options={themes.map((t) => ({ label: t, value: t }))}
              onChange={(e) => setTheme(e.value)}
              placeholder="Theme"
              className="w-[80px] sm:w-22 text-xs"
            />

          </div>

          <button
            className="text-[var(--color-white)] p-2 rounded-md"
            onClick={toggleSidebar}
          >
            <FaBars size={22} />
          </button>
        </header>
      )}


      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isMinimized={isMinimized}
            toggleMinimized={toggleMinimized}            
          />
        )}
        <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

