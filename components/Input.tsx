import React from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : {},
          props.editable === false ? styles.inputDisabled : {},
        ]}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
  },
  label: {
    ...FONTS.medium,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: SIZES.base,
    padding: SIZES.small,
    color: COLORS.text,
    ...FONTS.regular,
    fontSize: SIZES.medium,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputDisabled: {
    backgroundColor: COLORS.background,
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.error,
    ...FONTS.regular,
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
});

export default Input;