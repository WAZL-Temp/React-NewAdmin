import { create } from "../sharedBase/globalUtils";

interface LanguageStore {
  selectedLanguage: string;
  setLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  selectedLanguage: localStorage.getItem("app_language") || "en",
  setLanguage: (language) => {
    localStorage.setItem("app_language", language);
    set({ selectedLanguage: language });
  },
}));
