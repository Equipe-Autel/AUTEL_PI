import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/theme';

interface DatePickerProps {
  label?: string;
  value: string; // ISO date string YYYY-MM-DD
  onChange: (date: string) => void;
  minimumDate?: string;
  containerStyle?: ViewStyle;
}

const parseDate = (iso: string): Date => {
  if (!iso) return new Date();
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatDisplay = (iso: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

const toISO = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minimumDate,
  containerStyle,
}) => {
  const [show, setShow] = useState(false);
  const date = value ? parseDate(value) : new Date();
  const minDate = minimumDate ? parseDate(minimumDate) : undefined;

  const handleChange = (_: any, selected?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (selected) onChange(toISO(selected));
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.trigger} onPress={() => setShow(true)} activeOpacity={0.7}>
        <Ionicons name="calendar-outline" size={18} color={Colors.gray[400]} />
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value ? formatDisplay(value) : 'Selecione a data'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={Colors.gray[400]} />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minDate}
          onTouchCancel={() => setShow(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing[3],
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.gray[700],
    marginBottom: 6,
  },
  trigger: {
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    minHeight: 44,
  },
  triggerText: {
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    flex: 1,
  },
  placeholder: {
    color: Colors.gray[400],
  },
});
