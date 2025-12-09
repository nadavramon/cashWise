# CashWise - Smart Personal Finance Tracker 💰

CashWise is a modern, comprehensive mobile application designed to simplify personal finance management. Built with **React Native** and **Expo**, it offers a premium user experience with real-time tracking, smart budgeting, and flexible billing cycle management.

## ✨ Key Features

*   **📊 Interactive Dashboard:** Visualize spending habits with dynamic charts (`react-native-chart-kit`) and calendar views.
*   **🔄 Flexible Billing Cycles:**
    *   Set custom billing cycle start dates (e.g., 10th of every month).
    *   Use presets like "Current Cycle", "This Month", and "Last Month".
    *   Automatic date calculation logic ensures accurate reporting.
*   **� Smart Budgeting:**
    *   **Plan Mode:** Allocate funds to specific categories.
    *   **Remaining Mode:** Track how much is left for each category in real-time.
    *   **Insights:** Visual breakdowns of planned vs. actual spending.
*   **📂 Advanced Categorization:**
    *   Repository-based category system with groups and subcategories.
    *   Color-coded categories for easy visual identification.
*   **🎨 Premium UI/UX:**
    *   Glassmorphism aesthetic using `expo-blur` and `expo-glass-effect`.
    *   Smooth gradients and animations.
    *   Dark Mode support.
*   **☁️ Cloud Sync & Security:**
    *   Powered by **AWS Amplify** (AppSync GraphQL, DynamoDB).
    *   Secure authentication via **AWS Cognito**.

## 🛠 Tech Stack

*   **Framework:** React Native 0.81, Expo 54
*   **Language:** TypeScript
*   **Styling:** NativeWind (Tailwind CSS), Expo Linear Gradient
*   **Navigation:** React Navigation v7
*   **Backend:** AWS Amplify Gen 2 (Cognito, AppSync, DynamoDB)
*   **Charts:** React Native Chart Kit

## � Project Structure

The project follows a scalable, feature-based directory structure:

```
src/
├── api/                # API definitions and clients
├── assets/             # Static assets (images, fonts)
├── components/         # UI Components
│   ├── common/         # Low-level reusable components
│   └── features/       # Feature-specific components (Budget, Overview, Transactions)
├── config/             # Configuration (AWS, i18n, Themes)
├── context/            # React Contexts (State Management)
│   ├── AuthContext     # User authentication state
│   ├── CycleContext    # Billing cycle & date logic
│   └── ...
├── data/               # Static data repositories (CategoryRepo)
├── navigation/         # Navigation stacks (Auth, Main, Tabs)
├── screens/            # Application Screens
│   ├── auth/           # Authentication flow (SignIn, SignUp)
│   └── main/           # Main app flow (Overview, Budget, Tools)
├── types/              # TypeScript definitions
└── utils/              # Pure utility functions
```

## 🚀 Getting Started

### Prerequisites
*   Node.js (LTS recommended)
*   Expo Go app on your physical device OR Android Studio / Xcode for simulation.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/cashwise.git
    cd cashwise
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the application:**
    ```bash
    npx expo start
    ```

## 🏗 Architecture Highlights

### Billing Cycle Logic
CashWise employs a robust centralized cycle management system (`OverviewCycleContext`). Instead of relying on simple monthly boundaries, it calculates dynamic date ranges based on a user's preferred "Start Day". This ensures that dashboards, charts, and transaction lists all reflect the user's actual financial period (e.g., credit card cycle).

### Category Repository
Categories are managed via a static `CategoryRepo` pattern, allowing for easy expansion, color coding, and grouping of financial categories without polluting the database with repetitive metadata.

---

Built with ❤️ using React Native.
