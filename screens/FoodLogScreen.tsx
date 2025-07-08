import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import Card from '../components/Card';

const FoodLogScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock data for food log
  const foodLog = [
    {
      id: '1',
      mealType: 'Breakfast',
      time: '8:30 AM',
      name: 'Oatmeal with Berries',
      calories: 320,
      items: [
        { name: 'Oatmeal', calories: 150, amount: '1 cup' },
        { name: 'Mixed Berries', calories: 85, amount: '1/2 cup' },
        { name: 'Honey', calories: 65, amount: '1 tbsp' },
        { name: 'Almond Milk', calories: 20, amount: '1/4 cup' },
      ],
    },
    {
      id: '2',
      mealType: 'Lunch',
      time: '12:45 PM',
      name: 'Chicken Salad Sandwich',
      calories: 450,
      items: [
        { name: 'Whole Grain Bread', calories: 160, amount: '2 slices' },
        { name: 'Chicken Breast', calories: 180, amount: '100g' },
        { name: 'Lettuce & Tomato', calories: 25, amount: '30g' },
        { name: 'Mayo', calories: 85, amount: '1 tbsp' },
      ],
    },
    {
      id: '3',
      mealType: 'Snack',
      time: '3:30 PM',
      name: 'Apple with Peanut Butter',
      calories: 220,
      items: [
        { name: 'Apple', calories: 95, amount: '1 medium' },
        { name: 'Peanut Butter', calories: 125, amount: '1 tbsp' },
      ],
    },
    {
      id: '4',
      mealType: 'Dinner',
      time: '7:15 PM',
      name: 'Grilled Salmon with Vegetables',
      calories: 520,
      items: [
        { name: 'Salmon Fillet', calories: 280, amount: '150g' },
        { name: 'Roasted Vegetables', calories: 120, amount: '200g' },
        { name: 'Olive Oil', calories: 120, amount: '1 tbsp' },
      ],
    },
  ];

  // Calculate total calories for the day
  const totalCalories = foodLog.reduce((sum, meal) => sum + meal.calories, 0);
  
  // Generate dates for the date picker
  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    // Add 3 days before today
    for (let i = 3; i > 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    
    // Add today
    dates.push(today);
    
    // Add 3 days after today
    for (let i = 1; i <= 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const isDateSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleMealPress = (meal: any) => {
    // In a real app, we would navigate to a detail screen for this meal
    navigation.navigate('FoodDetail' as never, { meal } as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Log</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.datePickerContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScroller}
        >
          {getDates().map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                isDateSelected(date) && styles.selectedDateItem,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text 
                style={[
                  styles.dateText,
                  isDateSelected(date) && styles.selectedDateText,
                ]}
              >
                {formatDate(date)}
              </Text>
              <Text 
                style={[
                  styles.dayText,
                  isDateSelected(date) && styles.selectedDayText,
                ]}
              >
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalCalories}</Text>
          <Text style={styles.summaryLabel}>Calories</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>4</Text>
          <Text style={styles.summaryLabel}>Meals</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>2200</Text>
          <Text style={styles.summaryLabel}>Goal</Text>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {foodLog.map((meal) => (
          <TouchableOpacity 
            key={meal.id} 
            onPress={() => handleMealPress(meal)}
          >
            <Card style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View>
                  <Text style={styles.mealType}>{meal.mealType}</Text>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                </View>
                <Text style={styles.mealCalories}>{meal.calories} cal</Text>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.mealName}>{meal.name}</Text>
              
              <View style={styles.itemsContainer}>
                {meal.items.map((item, index) => (
                  <Text key={index} style={styles.itemText}>
                    • {item.name} ({item.amount}) - {item.calories} cal
                  </Text>
                ))}
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('Camera' as never)}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add Food</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  datePickerContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  dateScroller: {
    paddingHorizontal: SIZES.medium,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    marginRight: SIZES.small,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.background,
  },
  selectedDateItem: {
    backgroundColor: COLORS.primary,
  },
  dateText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  selectedDateText: {
    color: COLORS.white,
  },
  dayText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  selectedDayText: {
    color: COLORS.white,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  summaryLabel: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge,
  },
  mealCard: {
    marginBottom: SIZES.medium,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealType: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  mealTime: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  mealCalories: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SIZES.small,
  },
  mealName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  itemsContainer: {
    marginTop: SIZES.small,
  },
  itemText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.base,
    marginTop: SIZES.small,
  },
  addButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.white,
    marginLeft: SIZES.small,
  },
});

export default FoodLogScreen;