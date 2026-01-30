# Development Guide

Complete guide for setting up, developing, testing, and deploying Debtinator.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Building & Deployment](#building--deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x or higher | JavaScript runtime |
| npm | 9.x or higher | Package manager |
| Git | 2.x or higher | Version control |

### Platform-Specific Requirements

#### iOS Development (macOS only)

| Software | Version | Installation |
|----------|---------|--------------|
| Xcode | 15.0+ | Mac App Store |
| Xcode CLI Tools | Latest | `xcode-select --install` |
| CocoaPods | 1.14+ | `sudo gem install cocoapods` |

#### Android Development

| Software | Version | Installation |
|----------|---------|--------------|
| Android Studio | Latest | [Download](https://developer.android.com/studio) |
| Android SDK | API 34+ | Via Android Studio |
| Java JDK | 17 | Via Android Studio |

**Android Studio Setup**:
1. Install Android Studio
2. Open SDK Manager (Tools → SDK Manager)
3. Install Android 14 (API 34) SDK
4. Install Android SDK Build-Tools
5. Configure `ANDROID_HOME` environment variable

### Optional Tools

| Tool | Purpose |
|------|---------|
| [Expo Go](https://expo.dev/client) | Quick testing on physical devices |
| [VS Code](https://code.visualstudio.com/) | Recommended IDE |
| [React Native Debugger](https://github.com/jhen0409/react-native-debugger) | Enhanced debugging |

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/debtinator.git
cd debtinator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Installation

```bash
# Check Expo CLI
npx expo --version

# Check for common issues
npx expo doctor
```

### 4. IDE Configuration

#### VS Code Extensions

Install these recommended extensions:

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**
- **React Native Tools**

#### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

---

## Development Workflow

### Starting the Development Server

```bash
npm start
```

This starts the Expo development server and displays a QR code.

**Available Commands in Dev Server**:
| Key | Action |
|-----|--------|
| `i` | Open in iOS Simulator |
| `a` | Open in Android Emulator |
| `w` | Open in web browser |
| `r` | Reload the app |
| `m` | Toggle dev menu |
| `j` | Open debugger |

### Running on Specific Platforms

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

### Running on Physical Devices

**Using Expo Go**:
1. Install Expo Go on your device
2. Start the development server: `npm start`
3. Scan the QR code with your device's camera

**Using Development Build** (for native modules):
```bash
# Build development client
npm run build:dev

# Install on device and connect to dev server
```

### Hot Reloading

Changes to JavaScript/TypeScript code will hot reload automatically. For native code changes:

1. Stop the dev server
2. Rebuild the native app
3. Restart

### Code Organization Guidelines

#### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Tests: `*.test.ts` or `*.test.tsx`
- Types: `index.ts` (barrel exports)

#### Import Order

```typescript
// 1. React/React Native
import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

// 2. Third-party libraries
import { Text, Button } from 'react-native-paper';

// 3. Internal imports (using @ alias)
import { useDebts } from '@/store/useDebtStore';
import { Debt } from '@/types';
```

---

## Testing

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/utils/payoffCalculations.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="snowball"
```

### Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import ComponentUnderTest from './ComponentUnderTest';

describe('ComponentUnderTest', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should render correctly', () => {
    render(<ComponentUnderTest />);
    expect(screen.getByText('Expected Text')).toBeVisible();
  });

  it('should handle user interaction', () => {
    render(<ComponentUnderTest />);
    fireEvent.press(screen.getByTestId('button'));
    expect(screen.getByText('New State')).toBeVisible();
  });
});
```

### Coverage Requirements

The project enforces 100% code coverage:

```json
{
  "coverageThreshold": {
    "global": {
      "statements": 100,
      "branches": 100,
      "functions": 100,
      "lines": 100
    }
  }
}
```

**Viewing Coverage Reports**:

```bash
# Run tests with coverage
npm test

# Open HTML report
open coverage/lcov-report/index.html
```

### Mocking

#### Mocking Stores

```typescript
import { useDebtStore } from '@/store/useDebtStore';

jest.mock('@/store/useDebtStore');

const mockUseDebtStore = useDebtStore as jest.MockedFunction<typeof useDebtStore>;

beforeEach(() => {
  mockUseDebtStore.mockReturnValue({
    debts: [mockDebt],
    addDebt: jest.fn(),
    // ...
  });
});
```

#### Mocking Native Modules

Native modules are mocked in `src/__mocks__/`:

```typescript
// src/__mocks__/react-native-mmkv.ts
export class MMKV {
  private store = new Map<string, string>();
  
  getString(key: string) { return this.store.get(key); }
  set(key: string, value: string) { this.store.set(key, value); }
  delete(key: string) { this.store.delete(key); }
}
```

### End-to-End Testing

```bash
# Run Playwright tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run specific test
npx playwright test e2e/app.spec.ts
```

**Writing E2E Tests**:

```typescript
import { test, expect } from '@playwright/test';

test('user can add a debt', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="add-debt-fab"]');
  await page.fill('[data-testid="debt-form-name"]', 'Test Debt');
  await page.fill('[data-testid="debt-form-balance"]', '1000');
  await page.click('[data-testid="debt-form-submit"]');
  await expect(page.getByText('Test Debt')).toBeVisible();
});
```

---

## Building & Deployment

### Development Builds

Development builds include developer tools and debugging:

```bash
# Configure EAS (first time only)
npx eas login
npx eas build:configure

# Build for iOS
npx eas build --platform ios --profile development

# Build for Android
npx eas build --platform android --profile development
```

### Preview Builds

Internal testing builds without developer tools:

```bash
npm run build:preview
# or
npx eas build --profile preview
```

### Production Builds

App store ready builds:

```bash
npm run build:prod
# or
npx eas build --profile production
```

### Build Profiles

Configured in `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### App Store Submission

**iOS (App Store)**:

```bash
# Build for App Store
npx eas build --platform ios --profile production

# Submit to App Store
npx eas submit --platform ios
```

**Android (Google Play)**:

```bash
# Build for Play Store
npx eas build --platform android --profile production

# Submit to Play Store
npx eas submit --platform android
```

### Over-the-Air Updates

Push JavaScript updates without app store review:

```bash
# Publish update
npx eas update --branch production --message "Bug fixes"
```

---

## Troubleshooting

### Common Issues

#### "Unable to resolve module"

```bash
# Clear Metro cache
npx expo start --clear

# Or delete cache manually
rm -rf node_modules/.cache
```

#### "Command failed: pod install"

```bash
cd ios
pod deintegrate
pod install
cd ..
```

#### Android build fails

```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

#### Tests failing with act() warnings

Wrap state updates in `act()`:

```typescript
import { act } from '@testing-library/react-native';

await act(async () => {
  fireEvent.press(button);
});
```

### Debugging

#### React Native Debugger

1. Install React Native Debugger
2. Start the app: `npm start`
3. Press `j` to open debugger

#### Console Logging

```typescript
// Basic logging
console.log('Debug:', variable);

// Formatted object logging
console.log('State:', JSON.stringify(state, null, 2));
```

#### Network Debugging

Enable network inspection in React Native Debugger to see API calls.

### Performance

#### Identifying Re-renders

```typescript
import { useRef, useEffect } from 'react';

function useRenderCount(componentName: string) {
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current++;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });
}
```

#### Using React DevTools Profiler

1. Install React DevTools browser extension
2. Open DevTools and go to Profiler tab
3. Record a session and analyze render times

### Getting Help

1. Check [Expo Documentation](https://docs.expo.dev/)
2. Search [Expo Forums](https://forums.expo.dev/)
3. Check [React Native GitHub Issues](https://github.com/facebook/react-native/issues)
4. Ask on [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

---

## Development Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `expo start` | Start development server |
| `ios` | `expo run:ios` | Run on iOS simulator |
| `android` | `expo run:android` | Run on Android emulator |
| `web` | `expo start --web` | Run in web browser |
| `test` | `jest --coverage` | Run tests with coverage |
| `test:e2e` | `playwright test` | Run E2E tests |
| `test:e2e:ui` | `playwright test --ui` | Run E2E tests with UI |
| `build:dev` | `eas build --profile development` | Development build |
| `build:preview` | `eas build --profile preview` | Preview build |
| `build:prod` | `eas build --profile production` | Production build |
