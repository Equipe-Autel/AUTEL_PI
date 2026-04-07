import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={Colors.gray[400]}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
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
  input: {
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    backgroundColor: Colors.white,
    minHeight: 44,
  },
  inputFocused: {
    borderColor: Colors.teal,
  },
  inputError: {
    borderColor: Colors.red,
  },
  error: {
    fontSize: FontSizes.xs,
    color: Colors.red,
    marginTop: 4,
  },
});
