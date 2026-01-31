import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

let mockMode = 'light';
const mockSetMode = jest.fn();
jest.mock('@/store/useThemeStore', () => ({
  useThemeStore: (selector: (s: { mode: string; setMode: jest.Mock }) => unknown) =>
    selector({ mode: mockMode, setMode: mockSetMode }),
}));

let mockMonthlyIncome = 0;
const mockSetMonthlyIncome = jest.fn();
jest.mock('@/store/useIncomeStore', () => ({
  useIncomeStore: (selector: (s: { monthlyIncome: number; setMonthlyIncome: jest.Mock }) => unknown) =>
    selector({ monthlyIncome: mockMonthlyIncome, setMonthlyIncome: mockSetMonthlyIncome }),
}));

const mockSetOptions = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useNavigation: () => ({ setOptions: mockSetOptions }),
  useRouter: () => ({ push: mockPush }),
}));

function wrap(children: React.ReactNode) {
  return <PaperProvider>{children}</PaperProvider>;
}

import SettingsScreen from './settings';

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMode = 'light';
    mockPush.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders Appearance accordion', () => {
    render(wrap(<SettingsScreen />));
    expect(screen.getByText('Appearance')).toBeOnTheScreen();
  });

  it('renders theme options Light, Dark, System', () => {
    render(wrap(<SettingsScreen />));
    expect(screen.getByText('Light')).toBeOnTheScreen();
    expect(screen.getByText('Dark')).toBeOnTheScreen();
    expect(screen.getByText('System (match device)')).toBeOnTheScreen();
  });

  it('calls setOptions on mount (useLayoutEffect)', () => {
    render(wrap(<SettingsScreen />));
    expect(mockSetOptions).toHaveBeenCalled();
  });

  it('calls setMode when Light is pressed', () => {
    mockMode = 'dark';
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Light'));
    expect(mockSetMode).toHaveBeenCalledWith('light');
  });

  it('calls setMode when Dark is pressed', () => {
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Dark'));
    expect(mockSetMode).toHaveBeenCalledWith('dark');
  });

  it('calls setMode when System (match device) is pressed', () => {
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('System (match device)'));
    expect(mockSetMode).toHaveBeenCalledWith('system');
  });

  it('toggles accordion when Appearance is pressed', () => {
    render(wrap(<SettingsScreen />));
    expect(screen.getByText('Light')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Appearance'));
    fireEvent.press(screen.getByText('Appearance'));
    expect(screen.getByText('Light')).toBeOnTheScreen();
  });

  it('renders Help accordion', () => {
    render(wrap(<SettingsScreen />));
    expect(screen.getByText('Help')).toBeOnTheScreen();
  });

  it('renders Features Guide link when Help is expanded', () => {
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Help'));
    expect(screen.getByText('Features Guide')).toBeOnTheScreen();
    expect(screen.getByText('Learn how to use all app features')).toBeOnTheScreen();
  });

  it('navigates to documentation when Features Guide is pressed', () => {
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Help'));
    fireEvent.press(screen.getByText('Features Guide'));
    expect(mockPush).toHaveBeenCalledWith('/documentation');
  });

  it('has testID on help documentation link', () => {
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Help'));
    expect(screen.getByTestId('help-documentation-link')).toBeOnTheScreen();
  });

  it('renders Income accordion', () => {
    render(wrap(<SettingsScreen />));
    expect(screen.getByText('Income')).toBeOnTheScreen();
  });

  it('renders income input when Income accordion is expanded', () => {
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Income'));
    expect(screen.getByTestId('income-input')).toBeOnTheScreen();
  });

  it('calls setMonthlyIncome when income input loses focus with valid value', () => {
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Income'));
    const input = screen.getByTestId('income-input');
    fireEvent.changeText(input, '5000');
    fireEvent(input, 'blur');
    expect(mockSetMonthlyIncome).toHaveBeenCalledWith(5000);
  });

  it('syncs income input from store when monthlyIncome > 0', () => {
    mockMonthlyIncome = 5000;
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Income'));
    const input = screen.getByTestId('income-input');
    expect(input.props.value).toBe('5000');
  });

  it('clears income and sets 0 when blur with invalid value', () => {
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Income'));
    const input = screen.getByTestId('income-input');
    fireEvent.changeText(input, 'abc');
    fireEvent(input, 'blur');
    expect(mockSetMonthlyIncome).toHaveBeenCalledWith(0);
    expect(screen.getByTestId('income-input').props.value).toBe('');
  });

  it('clears income and sets 0 when blur with negative value', () => {
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Income'));
    const input = screen.getByTestId('income-input');
    fireEvent.changeText(input, '-100');
    fireEvent(input, 'blur');
    expect(mockSetMonthlyIncome).toHaveBeenCalledWith(0);
  });

  it('clears income input when blur with zero', () => {
    mockMonthlyIncome = 5000;
    render(wrap(<SettingsScreen />));
    fireEvent.press(screen.getByText('Income'));
    const input = screen.getByTestId('income-input');
    fireEvent.changeText(input, '0');
    fireEvent(input, 'blur');
    expect(mockSetMonthlyIncome).toHaveBeenCalledWith(0);
  });
});
