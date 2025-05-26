import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./assets/i18n/translation/en.json";
import hi from "./assets/i18n/translation/hi.json";
import mr from "./assets/i18n/translation/mr.json";


// Initialize i18n
void i18n
  .use(HttpBackend) 
  .use(LanguageDetector)
  .use(initReactI18next) 
  .init({
    resources: {
      en: {
        translation: en,
      },
      hi:{
        translation: hi,
      },
      mr:{
        translation: mr,
      }
    },
    lng: "en",
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });