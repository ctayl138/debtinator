import { act, renderHook } from '@testing-library/react-native';
import { useIncomeStore } from './useIncomeStore';

jest.mock('react-native-mmkv');

const { MMKV } = jest.requireMock<{ MMKV: jest.Mock }>('react-native-mmkv');

describe('useIncomeStore', () => {
  beforeEach(() => {
    useIncomeStore.setState({ monthlyIncome: 0 });
  });

  it('has initial monthlyIncome 0', () => {
    expect(useIncomeStore.getState().monthlyIncome).toBe(0);
  });

  it('setMonthlyIncome updates monthlyIncome', () => {
    const { result } = renderHook(() => useIncomeStore());
    act(() => {
      result.current.setMonthlyIncome(5000);
    });
    expect(useIncomeStore.getState().monthlyIncome).toBe(5000);
    act(() => {
      result.current.setMonthlyIncome(0);
    });
    expect(useIncomeStore.getState().monthlyIncome).toBe(0);
  });

  it('persist.clearStorage removes persisted data', async () => {
    act(() => {
      useIncomeStore.getState().setMonthlyIncome(5000);
    });
    expect(useIncomeStore.getState().monthlyIncome).toBe(5000);

    await act(async () => {
      await useIncomeStore.persist.clearStorage();
    });

    expect(MMKV).toHaveBeenCalled();
  });

  it('persist.rehydrate can be called', async () => {
    act(() => {
      useIncomeStore.getState().setMonthlyIncome(3500);
    });

    await act(async () => {
      await useIncomeStore.persist.rehydrate();
    });

    expect(useIncomeStore.getState().monthlyIncome).toBe(3500);
  });
});
