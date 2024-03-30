import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./locales";

i18n
  .use(initReactI18next)
  .init({
    resources: resources,
    lng: "pt-BR",
    fallbackLng: "pt-BR",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
