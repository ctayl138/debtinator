# Debtinator

A modern, cross-platform mobile application for managing personal debt and creating intelligent payoff plans. Built with React Native and Expo, Debtinator helps users visualize their debt-free journey using proven methodologies like the Snowball and Avalanche methods.

## Quick Links

| Documentation | Description |
|---------------|-------------|
| [Features](docs/FEATURES.md) | Complete feature guide with usage instructions |
| [Technology Stack](docs/TECHNOLOGY.md) | Detailed breakdown of all technologies used |
| [Architecture](docs/ARCHITECTURE.md) | System design, patterns, and project structure |
| [Development Guide](docs/DEVELOPMENT.md) | Setup, testing, building, and deployment |
| [API Reference](docs/API.md) | TypeScript types, stores, and utility functions |

## Overview

Debtinator empowers users to:

- **Track all debts** in one place with detailed information (balance, APR, minimum payments)
- **Choose a payoff strategy** that fits their goals (Snowball, Avalanche, or Custom)
- **Visualize progress** with interactive charts showing principal vs. interest breakdown
- **Plan ahead** with month-by-month payment schedules and timelines
- **Stay motivated** by seeing exactly when they'll be debt-free

## Screenshots

| Debts List | Payoff Plan | Charts |
|------------|-------------|--------|
| Manage all your debts | Calculate payoff schedules | Visualize your progress |

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- iOS: Xcode (macOS only)
- Android: Android Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/debtinator.git
cd debtinator

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

After starting the development server, you can:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator  
- Press `w` to open in web browser
- Scan the QR code with Expo Go on your physical device

## Tech Stack at a Glance

| Category | Technology |
|----------|------------|
| Framework | React Native with Expo SDK 52 |
| Navigation | Expo Router (file-based) |
| State Management | Zustand with persistence |
| Storage | MMKV (30x faster than AsyncStorage) |
| UI Components | React Native Paper (Material Design 3) |
| Charts | react-native-chart-kit |
| Language | TypeScript |
| Testing | Jest + React Native Testing Library |

## Project Structure

```
debtinator/
├── src/
│   ├── app/                    # Screens (Expo Router)
│   │   ├── (tabs)/            # Tab navigation
│   │   │   ├── debts.tsx      # Debt management
│   │   │   ├── payoff.tsx     # Payoff planning
│   │   │   └── index.tsx      # Home redirect
│   │   ├── charts.tsx         # Data visualization
│   │   ├── payoff-timeline.tsx # Month-by-month view
│   │   └── settings.tsx       # App settings
│   ├── components/            # Reusable UI components
│   ├── store/                 # Zustand state stores
│   ├── theme/                 # Design tokens & themes
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Business logic & helpers
├── assets/                    # Images and icons
├── e2e/                       # End-to-end tests
└── docs/                      # Documentation
```

## Key Features

### Debt Management
Add, edit, and organize debts by type (Credit Cards, Personal Loans, Other). View summary statistics including total debt, weighted average APR, and minimum payments.

### Payoff Strategies
- **Snowball Method**: Pay smallest balances first for psychological wins
- **Avalanche Method**: Pay highest interest first to minimize total interest
- **Custom Method**: Define your own payoff order (coming soon)

### Visualization
- **Pie Charts**: See principal vs. interest breakdown
- **Line Charts**: Track balance reduction over time
- **Timeline View**: Month-by-month payment schedule

### Theming
- Light and Dark mode support
- System theme detection
- Material Design 3 components

## Scripts

```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
npm test           # Run tests with coverage
npm run test:e2e   # Run Playwright E2E tests
npm run build:dev  # Build development client
npm run build:prod # Build production app
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing React Native toolchain
- [React Native Paper](https://reactnativepaper.com/) for Material Design components
- [Zustand](https://zustand-demo.pmnd.rs/) for lightweight state management
- [MMKV](https://github.com/mrousavy/react-native-mmkv) for blazing-fast storage
