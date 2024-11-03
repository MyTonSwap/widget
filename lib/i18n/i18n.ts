import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./resources";

export type supportedLanguages = keyof typeof resources;
export const supportedLanguages = Object.keys(
    resources
) as supportedLanguages[];
i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: "en",
        detection: {
            lookupQuerystring: "lang",
        },

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
