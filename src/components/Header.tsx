import { useEffect } from "react";
import img1 from '../assets/images/logo.png';
import { useTheme } from "../hooks/useTheme";
import { Button, Dropdown, FaBars, Image } from "../sharedBase/globalImports";
import { useLanguageStore } from "../store/useLanguage.store";
import { useTranslation } from "../sharedBase/globalUtils";

interface HeaderProps {
    toggleMinimized: () => void;
}

const Header = ({ toggleMinimized }: HeaderProps) => {
    const { t, i18n } = useTranslation();
    const { theme, setTheme, themes } = useTheme();
    const { selectedLanguage, setLanguage } = useLanguageStore();

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
    }, [selectedLanguage, i18n]);

    const handleLanguageChange = (language: string) => {
        setLanguage(language);
        localStorage.setItem("app_language", language);
        i18n.changeLanguage(language);
    };

    return (
        <header className="text-[var(--color-dark)] bg-[var(--color-white)]  py-1 border shadow-md flex items-center z-50 pl-3">
            <div className="flex items-center gap-2 font-semibold w-full justify-start">
                <Button
                    className="text-[var(--color-white)] bg-[var(--color-primary)] p-2  rounded-full hidden md:block lg:block"
                    onClick={toggleMinimized}
                >
                    <FaBars size={16} />
                </Button>

                <div className="flex items-center gap-1 pl-4 ">
                    <Image src={img1} alt="Logo" height='80' width='80' />
                </div>
            </div>

            <div className="flex gap-3 ml-auto pr-4 ">
                <div className="flex mx-2 space-x-2">
                    {["en", "hi", "mr"].map((lang) => (
                        <Button
                            key={lang}
                            className={`w-[80px] h-[36px] text-xs lg:text-sm border rounded-lg flex items-center justify-center
                                ${selectedLanguage === lang
                                    ? "bg-[var(--color-primary)] text-[var(--color-white)] border-[var(--color-white)]"
                                    : "bg-[var(--color-white)] text-[var(--color-primary)] border-[var(--color-border)]"
                                }`}
                            onClick={() => handleLanguageChange(lang)}
                        >
                            {lang === "en" ? t("globals.english") : lang === "hi" ? t("globals.hindi") : t("globals.marathi")}
                        </Button>
                    ))}
                </div>

                <Dropdown
                    value={theme}
                    options={themes.map((t) => ({ label: t, value: t }))}
                    onChange={(e) => setTheme(e.value)}
                    placeholder="Select Theme"
                    className="w-32     
                    p-column-filter text-sm bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md h-9 flex justify-center items-center"
                />
            </div>
        </header>
    );
};

export default Header;
