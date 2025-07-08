import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import Button from '../components/Button';
import Card from '../components/Card';

const HomeScreen = () => {
  const navigation = useNavigation();
  
  // Mock data for daily summary
  const dailySummary = {
    totalCalories: 1850,
    goal: 2200,
    remaining: 350,
    meals: 4,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, User!</Text>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
        </View>
        
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          <View style={styles.calorieInfo}>
            <View style={styles.calorieItem}>
              <Text style={styles.calorieValue}>{dailySummary.totalCalories}</Text>
              <Text style={styles.calorieLabel}>Consumed</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.calorieItem}>
              <Text style={styles.calorieValue}>{dailySummary.goal}</Text>
              <Text style={styles.calorieLabel}>Goal</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.calorieItem}>
              <Text style={styles.calorieValue}>{dailySummary.remaining}</Text>
              <Text style={styles.calorieLabel}>Remaining</Text>
            </View>
          </View>
        </Card>
        
        <View style={styles.actionsContainer}>
          <Button 
            title="Scan Food" 
            onPress={() => navigation.navigate('Camera' as never)}
            size="large"
            style={styles.scanButton}
          />
          <Button 
            title="View Food Log" 
            onPress={() => navigation.navigate('FoodLog' as never)}
            variant="outline"
            style={styles.logButton}
          />
        </View>
        
        <Text style={styles.recentTitle}>Recent Meals</Text>
        
        <Card>
          <View style={styles.mealItem}>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>Breakfast</Text>
              <Text style={styles.mealTime}>8:30 AM</Text>
              <Text style={styles.mealDescription}>Oatmeal with berries</Text>
            </View>
            <Text style={styles.mealCalories}>320 cal</Text>
          </View>
        </Card>
        
        <Card>
          <View style={styles.mealItem}>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>Lunch</Text>
              <Text style={styles.mealTime}>12:45 PM</Text>
              <Text style={styles.mealDescription}>Chicken salad sandwich</Text>
            </View>
            <Text style={styles.mealCalories}>450 cal</Text>
          </View>
        </Card>
        
        <Button 
          title="View All Meals" 
          onPress={() => navigation.navigate('FoodLog' as never)}
          variant="secondary"
          style={styles.viewAllButton}
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
    padding: SIZES.medium,
  },
  header: {
    marginBottom: SIZES.medium,
  },
  greeting: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.text,
  },
  date: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
  summaryCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.large,
  },
  summaryTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.white,
    marginBottom: SIZES.medium,
  },
  calorieInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieItem: {
    flex: 1,
    alignItems: 'center',
  },
  calorieValue: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.white,
  },
  calorieLabel: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.8,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.white,
    opacity: 0.3,
  },
  actionsContainer: {
    marginBottom: SIZES.large,
  },
  scanButton: {
    marginBottom: SIZES.small,
  },
  logButton: {
    marginBottom: SIZES.medium,
  },
  recentTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  mealTime: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
  },
  mealDescription: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  mealCalories: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  viewAllButton: {
    marginTop: SIZES.small,
  },
});

export default HomeScreen;