import { useEffect, useState } from "react";

const themes = ["light", "dark", "modern", "glacier", "aurora", "sapphire","blossom","breeze","peach","mint","lavender","sky"];


export const useTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);
    
    return { theme, setTheme, themes };
};
