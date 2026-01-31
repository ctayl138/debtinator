import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { List, Divider, useTheme, TextInput } from 'react-native-paper';
import { useNavigation, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/useThemeStore';
import { useIncomeStore } from '@/store/useIncomeStore';
import type { ThemeMode } from '@/theme/tokens';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System (match device)' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const router = useRouter();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const monthlyIncome = useIncomeStore((s) => s.monthlyIncome);
  const setMonthlyIncome = useIncomeStore((s) => s.setMonthlyIncome);
  const [expandedId, setExpandedId] = useState<string | number>('appearance');
  const [incomeInput, setIncomeInput] = useState(
    monthlyIncome > 0 ? monthlyIncome.toString() : ''
  );

  useEffect(() => {
    setIncomeInput(monthlyIncome > 0 ? monthlyIncome.toString() : '');
  }, [monthlyIncome]);

  const handleIncomeBlur = () => {
    const parsed = parseFloat(incomeInput);
    const value = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    setMonthlyIncome(value);
    setIncomeInput(value > 0 ? value.toString() : '');
  };

  const headerBg = (theme.colors as { header?: string }).header ?? theme.colors.surface;
  const headerFg = (theme.colors as { onHeader?: string }).onHeader ?? theme.colors.onSurface;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: headerBg },
      headerTintColor: headerFg,
      headerTitleStyle: { color: headerFg },
    });
  }, [navigation, headerBg, headerFg]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <List.AccordionGroup
        expandedId={expandedId}
        onAccordionPress={(id) => setExpandedId(expandedId === id ? '' : id)}
      >
        <List.Accordion
          id="appearance"
          title="Appearance"
          left={(props) => <List.Icon {...props} icon="palette-outline" />}
          right={(props) => (
            <List.Icon
              {...props}
              icon={props.isExpanded ? 'chevron-up' : 'chevron-down'}
            />
          )}
        >
          {THEME_OPTIONS.map((opt) => (
            <List.Item
              key={opt.value}
              title={opt.label}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={
                    opt.value === 'light'
                      ? 'white-balance-sunny'
                      : opt.value === 'dark'
                        ? 'weather-night'
                        : 'cellphone'
                  }
                />
              )}
              right={() =>
                mode === opt.value ? (
                  <List.Icon icon="check" color={theme.colors.primary} />
                ) : null
              }
              onPress={() => setMode(opt.value)}
            />
          ))}
        </List.Accordion>

        <Divider />

        <List.Accordion
          id="income"
          title="Income"
          left={(props) => <List.Icon {...props} icon="cash" />}
          right={(props) => (
            <List.Icon
              {...props}
              icon={props.isExpanded ? 'chevron-up' : 'chevron-down'}
            />
          )}
        >
          <TextInput
            label="Monthly Income (optional)"
            value={incomeInput}
            onChangeText={setIncomeInput}
            onBlur={handleIncomeBlur}
            mode="outlined"
            keyboardType="decimal-pad"
            placeholder="0.00"
            left={<TextInput.Affix text="$" />}
            style={styles.incomeInput}
            testID="income-input"
          />
        </List.Accordion>

        <Divider />

        <List.Accordion
          id="help"
          title="Help"
          left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
          right={(props) => (
            <List.Icon
              {...props}
              icon={props.isExpanded ? 'chevron-up' : 'chevron-down'}
            />
          )}
        >
          <List.Item
            title="Features Guide"
            description="Learn how to use all app features"
            left={(props) => <List.Icon {...props} icon="book-open-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/documentation')}
            testID="help-documentation-link"
          />
        </List.Accordion>
      </List.AccordionGroup>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  incomeInput: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
