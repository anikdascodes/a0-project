import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string; // Ionicons name
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = { ...styles.button };
    
    // Variant styles
    if (variant === 'primary') {
      buttonStyle = { ...buttonStyle, backgroundColor: COLORS.primary };
    } else if (variant === 'secondary') {
      buttonStyle = { ...buttonStyle, backgroundColor: COLORS.secondary };
    } else if (variant === 'outline') {
      buttonStyle = { 
        ...buttonStyle, 
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
      };
    }
    
    // Size styles
    if (size === 'small') {
      buttonStyle = { ...buttonStyle, paddingVertical: SIZES.small, paddingHorizontal: SIZES.medium };
    } else if (size === 'large') {
      buttonStyle = { ...buttonStyle, paddingVertical: SIZES.medium, paddingHorizontal: SIZES.extraLarge };
    }
    
    // Disabled style
    if (disabled) {
      buttonStyle = { ...buttonStyle, opacity: 0.5 };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleVar: TextStyle = { ...styles.text };
    
    if (variant === 'outline') {
      textStyleVar = { ...textStyleVar, color: COLORS.primary };
    }
    
    if (size === 'small') {
      textStyleVar = { ...textStyleVar, fontSize: SIZES.font };
    } else if (size === 'large') {
      textStyleVar = { ...textStyleVar, fontSize: SIZES.large };
    }
    
    return textStyleVar;
  };

  const getIconColor = () => {
    return variant === 'outline' ? COLORS.primary : COLORS.white;
  };

  const getIconSize = () => {
    if (size === 'small') return 16;
    if (size === 'large') return 24;
    return 20;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.white} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && (
            <Ionicons 
              name={icon as any} 
              size={getIconSize()} 
              color={getIconColor()} 
              style={styles.icon} 
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.base,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.white,
    ...FONTS.medium,
    fontSize: SIZES.medium,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SIZES.small,
  },
});

export default Button;