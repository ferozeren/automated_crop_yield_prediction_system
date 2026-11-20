import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const baseEn = {
  "nav.overview": "Overview",
  "nav.myfields": "My fields",
  "nav.recommendations": "Recommendations",
  "nav.insights": "Insights",
  "nav.weather": "Weather station",
  "nav.settings": "Settings",
  "nav.workspace": "WORKSPACE",
  "nav.tools": "TOOLS",
  "help.need": "Field guide",
  "help.guides": "Soil, fertilizer and irrigation notes from your own data.",
  "help.view": "View guides",
  "profile.farm": "Smallholder farm",
  "breadcrumb.workspace": "Workspace",
  "onboarding.title": "Start with your farm",
  "onboarding.subtitle": "Choose your state, language and city so weather and readings match your farm. State and language are required.",
  "onboarding.state": "State *",
  "onboarding.language": "Language *",
  "onboarding.city": "City (optional)",
  "onboarding.cityPlaceholder": "Search cities",
  "onboarding.notMentioned": "Not mentioned — use state capital",
  "onboarding.customCity": "Enter custom city",
  "onboarding.save": "Save and continue",
  "onboarding.required": "State and language are required",
  "onboarding.cityHint": "If you leave city blank, we use {{city}}, the capital of {{state}}. A custom city is tried as well.",
  "settings.language": "Language",
  "settings.state": "State",
  "settings.city": "City",
  "settings.clear": "Clear all data",
  "weather.title": "Weather station",
  "weather.subtitle": "What the sky is doing over your fields.",
  "services.title": "One check for each field decision.",
  "greeting.morning": "Good morning",
  "greeting.afternoon": "Good afternoon",
  "greeting.evening": "Good evening",
  "field.management": "Every field you track, with its readings.",
  "field.add": "Add field",
  "field.search": "Find a field or crop",
  "common.close": "Close",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "language.en": "English",
  "language.hi": "Hindi",
  "language.ta": "Tamil",
  "language.te": "Telugu",
  "language.kn": "Kannada",
  "language.ml": "Malayalam",
  "language.mr": "Marathi",
  "language.bn": "Bengali",
  "language.or": "Odia",
  "language.gu": "Gujarati",
  "language.pa": "Punjabi",
  "language.as": "Assamese",
  "language.ur": "Urdu"
};

const withFallback = (overrides) => ({ ...baseEn, ...overrides });

const resources = {
  en: { translation: baseEn },
  hi: { translation: withFallback({
    "nav.overview": "अवलोकन",
    "nav.myfields": "मेरे खेत",
    "nav.recommendations": "सिफारिशें",
    "nav.insights": "अंतर्दृष्टि",
    "nav.weather": "मौसम स्टेशन",
    "nav.settings": "सेटिंग्स",
    "onboarding.title": "Acreline में आपका स्वागत है",
    "onboarding.subtitle": "मौसम और सिफारिशों के लिए राज्य, भाषा और शहर चुनें।",
    "settings.language": "भाषा",
    "greeting.morning": "सुप्रभात",
    "greeting.afternoon": "नमस्ते",
    "greeting.evening": "शुभ संध्या"
  }) },
  ta: { translation: withFallback({
    "nav.overview": "மேலோட்டம்",
    "nav.myfields": "என் வயல்கள்",
    "nav.recommendations": "பரிந்துரைகள்",
    "nav.insights": "நுண்ணறிவு",
    "nav.weather": "வானிலை நிலையம்",
    "nav.settings": "அமைப்புகள்",
    "onboarding.title": "Acreline-க்கு வரவேற்கிறோம்"
  }) },
  te: { translation: withFallback({
    "nav.overview": "అవలోకనం",
    "nav.myfields": "నా పొలాలు",
    "nav.recommendations": "సిఫార్సులు",
    "nav.insights": "అంతర్దృష్టులు",
    "nav.weather": "వాతావరణ కేంద్రం",
    "nav.settings": "సెట్టింగ్‌లు"
  }) },
  kn: { translation: withFallback({
    "nav.overview": "ಅವಲೋಕನ",
    "nav.myfields": "ನನ್ನ ಹೊಲಗಳು",
    "nav.recommendations": "ಶಿಫಾರಸುಗಳು",
    "nav.insights": "ಒಳನೋಟಗಳು",
    "nav.weather": "ಹವಾಮಾನ ಕೇಂದ್ರ",
    "nav.settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು"
  }) },
  ml: { translation: withFallback({
    "nav.overview": "അവലോകനം",
    "nav.myfields": "എന്റെ പാടങ്ങൾ",
    "nav.recommendations": "ശുപാർശകൾ",
    "nav.insights": "ഉൾക്കാഴ്ചകൾ",
    "nav.weather": "കാലാവസ്ഥാ സ്റ്റേഷൻ",
    "nav.settings": "ക്രമീകരണങ്ങൾ"
  }) },
  mr: { translation: withFallback({
    "nav.overview": "आढावा",
    "nav.myfields": "माझी शेते",
    "nav.recommendations": "शिफारसी",
    "nav.insights": "अंतर्दृष्टी",
    "nav.weather": "हवामान केंद्र",
    "nav.settings": "सेटिंग्ज"
  }) },
  bn: { translation: withFallback({
    "nav.overview": "সংক্ষিপ্ত বিবরণ",
    "nav.myfields": "আমার ক্ষেত",
    "nav.recommendations": "সুপারিশ",
    "nav.insights": "অন্তর্দৃষ্টি",
    "nav.weather": "আবহাওয়া স্টেশন",
    "nav.settings": "সেটিংস"
  }) },
  or: { translation: withFallback({
    "nav.overview": "ସମୀକ୍ଷା",
    "nav.myfields": "ମୋ କ୍ଷେତ",
    "nav.recommendations": "ସୁପାରିସ",
    "nav.insights": "ଅନ୍ତର୍ଦୃଷ୍ଟି",
    "nav.weather": "ପାଣିପାଗ କେନ୍ଦ୍ର",
    "nav.settings": "ସେଟିଂସ"
  }) },
  gu: { translation: withFallback({
    "nav.overview": "ઝાંખી",
    "nav.myfields": "મારા ખેતરો",
    "nav.recommendations": "ભલામણો",
    "nav.insights": "આંતરદૃષ્ટિ",
    "nav.weather": "હવામાન કેન્દ્ર",
    "nav.settings": "સેટિંગ્સ"
  }) },
  pa: { translation: withFallback({
    "nav.overview": "ਸੰਖੇਪ",
    "nav.myfields": "ਮੇਰੇ ਖੇਤ",
    "nav.recommendations": "ਸਿਫਾਰਸ਼ਾਂ",
    "nav.insights": "ਸੂਝ",
    "nav.weather": "ਮੌਸਮ ਸਟੇਸ਼ਨ",
    "nav.settings": "ਸੈਟਿੰਗਾਂ"
  }) },
  as: { translation: withFallback({
    "nav.overview": "আভাস",
    "nav.myfields": "মোৰ পথাৰ",
    "nav.recommendations": "পৰামৰ্শ",
    "nav.insights": "অন্তৰ্দৃষ্টি",
    "nav.weather": "বতৰ কেন্দ্ৰ",
    "nav.settings": "ছেটিংছ"
  }) },
  ur: { translation: withFallback({
    "nav.overview": "جائزہ",
    "nav.myfields": "میرے کھیت",
    "nav.recommendations": "سفارشات",
    "nav.insights": "بصیرت",
    "nav.weather": "موسم اسٹیشن",
    "nav.settings": "ترتیبات"
  }) }
};

i18n.use(initReactI18next).init({
  resources,
  lng: (() => { try { return localStorage.getItem("acreline:language") || "en"; } catch { return "en"; } })(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnEmptyString: false
});

try { document.documentElement.lang = i18n.language || "en"; } catch {}
i18n.on("languageChanged", (lng) => { try { document.documentElement.lang = lng; } catch {} });

export default i18n;
