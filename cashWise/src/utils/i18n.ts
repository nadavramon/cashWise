import { I18nManager } from 'react-native';

export type LanguageCode = 'en' | 'he';

export const TRANSLATIONS = {
    en: {
        profileSettings: 'Profile & Settings',
        email: 'Email',
        firstName: 'First name',
        lastName: 'Last name',
        currency: 'Currency',
        defaultDateRange: 'Default date range preset',
        language: 'Language',
        save: 'Save',
        saving: 'Saving...',
        saved: 'Saved',
        profileUpdated: 'Profile updated.',
        error: 'Error',
        failedToSave: 'Failed to save profile.',
        loading: 'Loading profile...',
        // Add more keys as needed for other screens
    },
    he: {
        profileSettings: 'הגדרות פרופיל',
        email: 'אימייל',
        firstName: 'שם פרטי',
        lastName: 'שם משפחה',
        currency: 'מטבע',
        defaultDateRange: 'טווח תאריכים ברירת מחדל',
        language: 'שפה',
        save: 'שמור',
        saving: 'שומר...',
        saved: 'נשמר',
        profileUpdated: 'הפרופיל עודכן.',
        error: 'שגיאה',
        failedToSave: 'שמירת הפרופיל נכשלה.',
        loading: 'טוען פרופיל...',
    },
};

export const t = (key: keyof typeof TRANSLATIONS['en'], lang: string = 'en') => {
    const code = (lang === 'he' ? 'he' : 'en') as LanguageCode;
    return TRANSLATIONS[code][key] || TRANSLATIONS['en'][key] || key;
};

export const isRTL = (lang: string) => lang === 'he';
