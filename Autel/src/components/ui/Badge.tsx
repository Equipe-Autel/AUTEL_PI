import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, FontSizes } from '../../constants/theme';

type Variant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', style }) => (
  <View style={[styles.base, styles[`variant_${variant}`], style]}>
    <Text style={[styles.text, styles[`text_${variant}`]]}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },

  variant_default: { backgroundColor: Colors.teal },
  variant_secondary: { backgroundColor: Colors.gray[200] },
  variant_destructive: { backgroundColor: Colors.redLight },
  variant_outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.gray[300] },
  variant_success: { backgroundColor: Colors.greenLight },
  variant_warning: { backgroundColor: Colors.yellowLight },

  text_default: { color: Colors.white },
  text_secondary: { color: Colors.gray[700] },
  text_destructive: { color: Colors.red },
  text_outline: { color: Colors.gray[700] },
  text_success: { color: '#15803D' },
  text_warning: { color: '#92400E' },
});
