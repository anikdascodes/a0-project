import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!re.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const validateName = (name: string) => {
    if (!name && !isLogin) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };
  
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword && !isLogin) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password && !isLogin) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };
  
  const handleSubmit = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    let isFormValid = isEmailValid && isPasswordValid;
    
    if (!isLogin) {
      const isNameValid = validateName(name);
      const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
      isFormValid = isFormValid && isNameValid && isConfirmPasswordValid;
    }
    
    if (isFormValid) {
      // In a real app, we would handle authentication here
      navigation.navigate('Home' as never);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear form and errors when switching modes
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setConfirmPasswordError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.appName}>CalorieScan</Text>
          <Text style={styles.appTagline}>
            AI-powered food recognition & calorie tracking
          </Text>
        </View>
        
        <Card style={styles.authCard}>
          <Text style={styles.authTitle}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Text>
          
          {!isLogin && (
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={nameError}
            />
          )}
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
          />
          
          {!isLogin && (
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={confirmPasswordError}
            />
          )}
          
          <Button
            title={isLogin ? 'Sign In' : 'Sign Up'}
            onPress={handleSubmit}
            size="large"
            style={styles.submitButton}
          />
          
          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
        </Card>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <TouchableOpacity onPress={toggleAuthMode}>
            <Text style={styles.switchActionText}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>
        
        <Button
          title="Continue as Guest"
          onPress={() => navigation.navigate('Home' as never)}
          variant="outline"
          style={styles.guestButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.medium,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  appName: {
    ...FONTS.bold,
    fontSize: SIZES.xxxl,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  appTagline: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  authCard: {
    marginBottom: SIZES.medium,
  },
  authTitle: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  submitButton: {
    marginTop: SIZES.small,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: SIZES.medium,
  },
  forgotPasswordText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.medium,
  },
  switchText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginRight: SIZES.small,
  },
  switchActionText: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.medium,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  dividerText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginHorizontal: SIZES.small,
  },
  guestButton: {
    marginBottom: SIZES.large,
  },
});

export default LoginScreen;