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
        billingCycleStartDay: 'Billing Cycle Start Day (1-31)',
        invalidStartDay: 'Billing cycle start day must be between 1 and 31',
        // Add more keys as needed for other screens

        // Navigation
        navOverview: 'Overview',
        navBudget: 'Budget',
        navTools: 'Tools',
        navTransactions: 'Transactions',

        // Overview
        overviewTitle: 'Overview',
        modeDashboard: 'Dashboard',
        modeSpending: 'Spending',
        modeList: 'List',
        addTransaction: 'Add transaction',

        // Budget
        budgetTitle: 'Budget',
        modePlan: 'Plan',
        modeRemaining: 'Remaining',
        modeInsights: 'Insights',
        remainingComingSoon: 'Remaining view coming soon',
        insightsComingSoon: 'Insights view coming soon',

        // Transactions
        transactionsTitle: 'Transactions',
        filterCurrentCycle: 'Current Cycle',
        filterThisMonth: 'This month',
        filterLastMonth: 'Last month',
        filterThisWeek: 'This week',
        exportCSV: 'Export CSV',
        deleteTransactionTitle: 'Delete transaction',
        deleteTransactionMessage: 'Delete {type} of {amount}?',
        exportError: 'Cannot open the export URL',
        exportFailed: 'Export Failed',

        // Tools
        toolsProfile: 'Profile',
        toolsManualCategory: 'Add Manual Category',

        // Budget Details
        totalPlannedExpenses: 'Total planned expenses',
        noPlannedExpenses: 'No planned expenses yet.',

        // Transaction Form
        newTransaction: 'New transaction',
        income: 'Income',
        expense: 'Expense',
        uncategorized: 'Uncategorized',
        amount: 'Amount',
        category: 'Category',
        note: 'Note',
        notePlaceholder: 'Add a note...',
        date: 'Date',
        recurringTransaction: 'Recurring Transaction',
        featureComingSoon: '(Feature coming soon)',
        saveChanges: 'Save Changes',
        invalidAmount: 'Invalid amount',
        pleaseEnterPositiveAmount: 'Please enter a positive number.',
        missingCategory: 'Missing category',
        pleaseSelectCategory: 'Please select a category.',
        invalidDate: 'Invalid date',
        invalidDateFormat: 'Invalid date format (YYYY-MM-DD).',
        includeInStats: 'Include in stats?',
        yes: 'Yes',
        no: 'No',
        transactionNotFound: 'Transaction not found. Maybe it was deleted or not loaded yet.',
        failedToUpdate: 'Failed to update transaction. Please try again.',

        // Tools Screen
        signOut: 'Sign Out',
        signOutConfirm: 'Are you sure you want to sign out?',
        noRange: 'No Range',
        noRangeMessage: 'Please set a date range before exporting.',
        exportReady: 'Export ready',
        downloadUrlCopied: 'Download URL copied:\n',
        exportFailedMessage: 'Unable to export data.',
        editDetails: 'Edit details',
        manageTags: 'Manage tags',
        getYourData: 'Get your data',
        logOutSafely: 'Log out safely',
        general: 'General',
        version: 'Version',

        // Manual Category Screen
        missingName: 'Missing name',
        enterCategoryName: 'Please enter a category name.',
        failedToUpdateCategory: 'Failed to update category.',
        failedToAddCategory: 'Failed to add category.',
        deleteCategory: 'Delete category',
        deleteCategoryConfirm: 'Are you sure you want to delete "{name}"? Existing transactions will still reference it.',
        failedToDeleteCategory: 'Failed to delete category.',
        editCategory: 'Edit category',
        newCategory: 'New category',
        categoryPlaceholder: 'e.g. Groceries',
        cancelEdit: 'Cancel edit',
        expenseCategories: 'Expense Categories',
        incomeCategories: 'Income Categories',

        // Common
        cancel: 'Cancel',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        addCategory: 'Add category',
        empty: 'Empty',
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
        billingCycleStartDay: 'יום תחילת מחזור חיוב',
        invalidStartDay: 'יום תחילת מחזור חייב להיות בין 1 ל-31',

        // Navigation
        navOverview: 'מבט על',
        navBudget: 'תקציב',
        navTools: 'כלים',
        navTransactions: 'תנועות',

        // Overview
        overviewTitle: 'מבט על',
        modeDashboard: 'לוח בקרה',
        modeSpending: 'הוצאות',
        modeList: 'רשימה',
        addTransaction: 'הוסף תנועה',

        // Budget
        budgetTitle: 'תקציב',
        modePlan: 'תכנון',
        modeRemaining: 'יתרה',
        modeInsights: 'תובנות',
        remainingComingSoon: 'תצוגת יתרה בקרוב',
        insightsComingSoon: 'תצוגת תובנות בקרוב',

        // Transactions
        transactionsTitle: 'תנועות',
        filterCurrentCycle: 'מחזור נוכחי',
        filterThisMonth: 'החודש',
        filterLastMonth: 'חודש שעבר',
        filterThisWeek: 'השבוע',
        exportCSV: 'ייצוא CSV',
        deleteTransactionTitle: 'מחק תנועה',
        deleteTransactionMessage: 'למחוק {type} בסך {amount}?',
        exportError: 'לא ניתן לפתוח את הקישור',
        exportFailed: 'הייצוא נכשל',

        // Tools
        toolsProfile: 'פרופיל',
        toolsManualCategory: 'הוסף קטגוריה ידנית',

        // Budget Details
        totalPlannedExpenses: 'סה״כ הוצאות מתוכננות',
        noPlannedExpenses: 'אין הוצאות מתוכננות עדיין.',

        // Transaction Form
        newTransaction: 'תנועה חדשה',
        income: 'הכנסה',
        expense: 'הוצאה',
        uncategorized: 'ללא קטגוריה',
        amount: 'סכום',
        category: 'קטגוריה',
        note: 'הערה',
        notePlaceholder: 'הוסף הערה...',
        date: 'תאריך',
        recurringTransaction: 'תנועה חוזרת',
        featureComingSoon: '(בקרוב)',
        saveChanges: 'שמור שינויים',
        invalidAmount: 'סכום לא תקין',
        pleaseEnterPositiveAmount: 'נא להזין מספר חיובי.',
        missingCategory: 'חסרה קטגוריה',
        pleaseSelectCategory: 'נא לבחור קטגוריה.',
        invalidDate: 'תאריך לא תקין',
        invalidDateFormat: 'פורמט תאריך לא תקין (YYYY-MM-DD).',
        includeInStats: 'לכלול בסטטיסטיקה?',
        yes: 'כן',
        no: 'לא',
        transactionNotFound: 'התנועה לא נמצאה. ייתכן שנמחקה או טרם נטענה.',
        failedToUpdate: 'עדכון התנועה נכשל. נא לנסות שוב.',

        // Tools Screen
        signOut: 'התנתק',
        signOutConfirm: 'האם אתה בטוח שברצונך להתנתק?',
        noRange: 'אין טווח תאריכים',
        noRangeMessage: 'נא לבחור טווח תאריכים לפני הייצוא.',
        exportReady: 'הייצוא מוכן',
        downloadUrlCopied: 'קישור להורדה הועתק:\n',
        exportFailedMessage: 'לא ניתן לייצא נתונים.',
        editDetails: 'ערוך פרטים',
        manageTags: 'ניהול תגיות',
        getYourData: 'קבל את הנתונים שלך',
        logOutSafely: 'התנתק בבטחה',
        general: 'כללי',
        version: 'גרסה',

        // Manual Category Screen
        missingName: 'חסר שם',
        enterCategoryName: 'נא להזין שם קטגוריה.',
        failedToUpdateCategory: 'עדכון הקטגוריה נכשל.',
        failedToAddCategory: 'הוספת הקטגוריה נכשלה.',
        deleteCategory: 'מחק קטגוריה',
        deleteCategoryConfirm: 'האם אתה בטוח שברצונך למחוק את "{name}"? תנועות קיימות עדיין יתייחסו אליה.',
        failedToDeleteCategory: 'מחיקת הקטגוריה נכשלה.',
        editCategory: 'ערוך קטגוריה',
        newCategory: 'קטגוריה חדשה',
        categoryPlaceholder: 'לדוגמה: קניות',
        cancelEdit: 'בטל עריכה',
        expenseCategories: 'קטגוריות הוצאה',
        incomeCategories: 'קטגוריות הכנסה',

        // Common
        cancel: 'ביטול',
        add: 'הוסף',
        edit: 'ערוך',
        delete: 'מחק',
        addCategory: 'הוסף קטגוריה',
        empty: 'ריק',
    },
};

export const t = (key: keyof typeof TRANSLATIONS['en'], lang: string = 'en') => {
    const code = (lang === 'he' ? 'he' : 'en') as LanguageCode;
    return TRANSLATIONS[code][key] || TRANSLATIONS['en'][key] || key;
};

export const isRTL = (lang: string) => lang === 'he';
