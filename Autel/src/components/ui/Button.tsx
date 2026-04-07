import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, BorderRadius, FontSizes } from '../../constants/theme';

type Variant = 'default' | 'outline' | 'destructive' | 'ghost' | 'secondary';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'default',
  size = 'md',
  disabled,
  loading,
  style,
  textStyle,
  fullWidth,
}) => {
  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const labelStyle: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    textStyle as TextStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={containerStyle}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.teal : Colors.white}
          size="small"
        />
      ) : (
        <Text style={labelStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Variants
  variant_default: {
    backgroundColor: Colors.teal,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.teal,
  },
  variant_destructive: {
    backgroundColor: Colors.red,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_secondary: {
    backgroundColor: Colors.gray[200],
  },

  // Sizes
  size_sm: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    minHeight: 34,
  },
  size_md: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    minHeight: 44,
  },
  size_lg: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 52,
  },

  // Text
  text: {
    fontWeight: '600',
  },
  text_default: {
    color: Colors.white,
  },
  text_outline: {
    color: Colors.teal,
  },
  text_destructive: {
    color: Colors.white,
  },
  text_ghost: {
    color: Colors.teal,
  },
  text_secondary: {
    color: Colors.gray[700],
  },

  // Text sizes
  textSize_sm: {
    fontSize: FontSizes.sm,
  },
  textSize_md: {
    fontSize: FontSizes.base,
  },
  textSize_lg: {
    fontSize: FontSizes.lg,
  },
});
