import { CategoryType } from '../types/models';

export interface RepoCategoryItem {
    code: string;
    label: string;
    type: CategoryType;
    icon: string; // Ionicons name
}

export interface RepoCategoryGroup {
    id: string;
    title: string;
    color: string;       // Static brand colors (visible in both Light & Dark modes)
    items: RepoCategoryItem[];
}

// CASHWISE BRAND PALETTE ADAPTATION
// We use your main theme colors for the major categories.
export const CATEGORY_REPO: RepoCategoryGroup[] = [
    {
        id: 'entertainment',
        title: 'Entertainment',
        color: '#9D4EDD', // Lighter Purple
        items: [
            { code: 'ENT_BOWLING', label: 'Bowling', type: 'expense', icon: 'bowling-ball-outline' },
            { code: 'ENT_CINEMA', label: 'Cinema', type: 'expense', icon: 'film-outline' },
            { code: 'ENT_CONCERT', label: 'Concert', type: 'expense', icon: 'musical-notes-outline' },
            { code: 'ENT_ELECTRONICS', label: 'Electronics', type: 'expense', icon: 'game-controller-outline' },
            { code: 'ENT_GYM', label: 'Gym', type: 'expense', icon: 'barbell-outline' },
            { code: 'ENT_HOBBY', label: 'Hobby', type: 'expense', icon: 'color-palette-outline' },
            { code: 'ENT_NIGHTCLUB', label: 'Nightclub', type: 'expense', icon: 'wine-outline' },
            { code: 'ENT_SPORTS', label: 'Sports', type: 'expense', icon: 'football-outline' },
            { code: 'ENT_SUBSCRIPTION', label: 'Subscription', type: 'expense', icon: 'card-outline' },
            { code: 'ENT_VACATION', label: 'Vacation', type: 'expense', icon: 'airplane-outline' },
        ],
    },
    {
        id: 'food_drinks',
        title: 'Food & Drinks',
        color: '#FF9F1C', // Vibrant Orange
        items: [
            { code: 'FOOD_CANDY', label: 'Candy', type: 'expense', icon: 'nutrition-outline' },
            { code: 'FOOD_COFFEE', label: 'Coffee', type: 'expense', icon: 'cafe-outline' },
            { code: 'FOOD_DRINKS', label: 'Drinks', type: 'expense', icon: 'beer-outline' },
            { code: 'FOOD_FOOD', label: 'Food', type: 'expense', icon: 'fast-food-outline' },
            { code: 'FOOD_GROCERIES', label: 'Groceries', type: 'expense', icon: 'cart-outline' },
            { code: 'FOOD_RESTAURANT', label: 'Restaurant', type: 'expense', icon: 'restaurant-outline' },
        ],
    },
    {
        id: 'housing',
        title: 'Housing',
        color: '#007CBE', // CashWise Primary Blue
        items: [
            { code: 'HOUSE_BANK', label: 'Bank', type: 'expense', icon: 'business-outline' },
            { code: 'HOUSE_BILLS', label: 'Bills', type: 'expense', icon: 'receipt-outline' },
            { code: 'HOUSE_ELECTRICITY', label: 'Electricity', type: 'expense', icon: 'flash-outline' },
            { code: 'HOUSE_SUPPLIES', label: 'Home Supplies', type: 'expense', icon: 'home-outline' },
            { code: 'HOUSE_HOUSING', label: 'Housing', type: 'expense', icon: 'key-outline' },
            { code: 'HOUSE_INSURANCE', label: 'Insurance', type: 'expense', icon: 'shield-checkmark-outline' },
            { code: 'HOUSE_INTERNET', label: 'Internet', type: 'expense', icon: 'wifi-outline' },
            { code: 'HOUSE_LOAN', label: 'Loan', type: 'expense', icon: 'cash-outline' },
            { code: 'HOUSE_MAINTENANCE', label: 'Maintenance', type: 'expense', icon: 'hammer-outline' },
            { code: 'HOUSE_RENT', label: 'Rent', type: 'expense', icon: 'calendar-outline' },
            { code: 'HOUSE_SERVICE', label: 'Service', type: 'expense', icon: 'construct-outline' },
            { code: 'HOUSE_TV', label: 'TV', type: 'expense', icon: 'tv-outline' },
            { code: 'HOUSE_TAXES', label: 'Taxes', type: 'expense', icon: 'document-text-outline' },
            { code: 'HOUSE_TELEPHONE', label: 'Telephone', type: 'expense', icon: 'call-outline' },
            { code: 'HOUSE_WATER', label: 'Water', type: 'expense', icon: 'water-outline' },
        ],
    },
    {
        id: 'income',
        title: 'Income',
        color: '#02C3BD', // CashWise Primary Teal
        items: [
            { code: 'INC_CHILD_BENEFIT', label: 'Child Benefit', type: 'income', icon: 'happy-outline' },
            { code: 'INC_INCOME', label: 'Income', type: 'income', icon: 'wallet-outline' },
            { code: 'INC_INTEREST', label: 'Interest', type: 'income', icon: 'trending-up-outline' },
            { code: 'INC_INVESTMENTS', label: 'Investments', type: 'income', icon: 'bar-chart-outline' },
            { code: 'INC_PENSION', label: 'Pension', type: 'income', icon: 'time-outline' },
            { code: 'INC_SALARY', label: 'Salary', type: 'income', icon: 'briefcase-outline' },
        ],
    },
    {
        id: 'lifestyle',
        title: 'Lifestyle',
        color: '#FF6B9C', // Hot Pink
        items: [
            { code: 'LIFE_CHARITY', label: 'Charity', type: 'expense', icon: 'heart-outline' },
            { code: 'LIFE_CHILD_CARE', label: 'Child Care', type: 'expense', icon: 'people-outline' },
            { code: 'LIFE_COMMUNITY', label: 'Community', type: 'expense', icon: 'people-circle-outline' },
            { code: 'LIFE_DENTIST', label: 'Dentist', type: 'expense', icon: 'medkit-outline' },
            { code: 'LIFE_DOCTOR', label: 'Doctor', type: 'expense', icon: 'medical-outline' },
            { code: 'LIFE_EDUCATION', label: 'Education', type: 'expense', icon: 'school-outline' },
            { code: 'LIFE_GIFT', label: 'Gift', type: 'expense', icon: 'gift-outline' },
            { code: 'LIFE_HOTEL', label: 'Hotel', type: 'expense', icon: 'bed-outline' },
            { code: 'LIFE_PET', label: 'Pet', type: 'expense', icon: 'paw-outline' },
            { code: 'LIFE_PHARMACY', label: 'Pharmacy', type: 'expense', icon: 'bandage-outline' },
            { code: 'LIFE_SHOPPING', label: 'Shopping', type: 'expense', icon: 'bag-handle-outline' },
            { code: 'LIFE_TRAVEL', label: 'Travel', type: 'expense', icon: 'airplane-outline' },
        ],
    },
    {
        id: 'savings',
        title: 'Savings',
        color: '#20BF55', // Strong Green
        items: [
            { code: 'SAV_EMERGENCY', label: 'Emergency Savings', type: 'expense', icon: 'alert-circle-outline' },
            { code: 'SAV_SAVINGS', label: 'Savings', type: 'expense', icon: 'save-outline' },
            { code: 'SAV_VACATION', label: 'Vacation savings', type: 'expense', icon: 'sunny-outline' },
        ],
    },
    {
        id: 'transportation',
        title: 'Transportation',
        color: '#F5C518', // Gold/Dark Yellow
        items: [
            { code: 'TRANS_CAR_COSTS', label: 'Car costs', type: 'expense', icon: 'car-outline' },
            { code: 'TRANS_CAR_INSURANCE', label: 'Car insurance', type: 'expense', icon: 'shield-outline' },
            { code: 'TRANS_CAR_LOAN', label: 'Car loan', type: 'expense', icon: 'cash-outline' },
            { code: 'TRANS_FLIGHT', label: 'Flight', type: 'expense', icon: 'airplane-outline' },
            { code: 'TRANS_GAS', label: 'Gas', type: 'expense', icon: 'speedometer-outline' },
            { code: 'TRANS_PARKING', label: 'Parking', type: 'expense', icon: 'stop-circle-outline' },
            { code: 'TRANS_PUBLIC', label: 'Public transport', type: 'expense', icon: 'bus-outline' },
            { code: 'TRANS_REPAIR', label: 'Repair', type: 'expense', icon: 'construct-outline' },
            { code: 'TRANS_TAXI', label: 'Taxi', type: 'expense', icon: 'car-sport-outline' },
        ],
    },
];