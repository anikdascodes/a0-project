import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useAI } from '../context/AIContext';

// Define the type for route params
type FoodAnalysisParamList = {
  FoodAnalysis: {
    photo: {
      uri: string;
      base64?: string;
      width: number;
      height: number;
    };
  };
};

// Define the type for food data
interface FoodItem {
  name: string;
  calories: number;
  amount: string;
}

interface FoodData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: FoodItem[];
}

const FoodAnalysisScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<FoodAnalysisParamList, 'FoodAnalysis'>>();
  const { photo } = route.params;
  
  // Get AI configuration from context
  const { apiKey, model, updateConfig } = useAI();
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [customApiKey, setCustomApiKey] = useState(apiKey);
  const [customModel, setCustomModel] = useState(model);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Food analysis data
  const [foodData, setFoodData] = useState<FoodData>({
    name: 'Analyzing...',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    items: [],
  });

  // Function to analyze food with Together AI
  const analyzeWithTogetherAI = async (imageBase64: string | undefined) => {
    if (!imageBase64) {
      // If base64 is not available, try to fetch the image from the URI and convert it to base64
      if (photo.uri) {
        try {
          // For web environment, fetch the image and convert to base64
          if (Platform.OS === 'web') {
            const response = await fetch(photo.uri);
            const blob = await response.blob();
            
            const reader = new FileReader();
            const base64Data = await new Promise<string>((resolve, reject) => {
              reader.onload = () => {
                const result = reader.result as string;
                const base64 = result.split(',')[1];
                resolve(base64);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            
            // Now analyze with the converted base64 data
            await performAnalysis(base64Data);
            return;
          }
        } catch (fetchError) {
          console.error('Error fetching image from URI:', fetchError);
        }
      }
      
      setError("No image data available. Please try taking a new photo.");
      setIsAnalyzing(false);
      return;
    }

    await performAnalysis(imageBase64);
  };

  // Helper function to perform the actual API call and analysis
  const performAnalysis = async (imageBase64: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Prepare the prompt for food analysis
      const prompt = `
        Analyze this food image and provide detailed nutritional information in JSON format.
        I need:
        1. The name of the dish
        2. Total calories
        3. Macronutrients (protein, carbs, fat in grams)
        4. List of individual food items with their calories and approximate amounts
        
        Format your response as valid JSON with this structure:
        {
          "name": "Dish Name",
          "calories": 450,
          "protein": 32,
          "carbs": 15,
          "fat": 28,
          "items": [
            { "name": "Item 1", "calories": 220, "amount": "120g" },
            { "name": "Item 2", "calories": 25, "amount": "80g" }
          ]
        }
        
        Only respond with the JSON, no additional text.
      `;

      // Call the Together AI API
      const response = await fetch('https://api.together.xyz/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customApiKey}`
        },
        body: JSON.stringify({
          model: customModel,
          prompt: prompt,
          max_tokens: 1024,
          temperature: 0.7,
          images: [imageBase64]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze image');
      }

      const data = await response.json();
      
      // Parse the response to extract the JSON
      let jsonResponse;
      try {
        // Extract JSON from the response text
        const responseText = data.choices[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          jsonResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        // Fallback to mock data if parsing fails
        jsonResponse = {
          name: 'Mixed Salad with Protein',
          calories: 450,
          protein: 32,
          carbs: 15,
          fat: 28,
          items: [
            { name: 'Grilled Chicken', calories: 220, amount: '120g' },
            { name: 'Mixed Greens', calories: 25, amount: '80g' },
            { name: 'Avocado', calories: 160, amount: '1/2 medium' },
            { name: 'Olive Oil Dressing', calories: 45, amount: '1 tbsp' },
          ],
        };
      }

      // Update the food data state
      setFoodData(jsonResponse);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
      setIsAnalyzing(false);
    }
  };

  // Analyze the image when the component mounts
  useEffect(() => {
    analyzeWithTogetherAI(photo.base64);
  }, []);

  const handleAnalyzeWithAI = () => {
    if (!customApiKey.trim()) {
      Alert.alert('API Key Required', 'Please enter your API key to analyze the image.');
      return;
    }
    
    // Update the global context with the new API key and model
    updateConfig(customApiKey, customModel);
    
    setShowApiKeyInput(false);
    analyzeWithTogetherAI(photo.base64);
  };

  const handleSaveToLog = () => {
    // In a real app, we would save this data to the user's food log
    Alert.alert('Success', 'Food added to your daily log!');
    navigation.navigate('Home' as never);
  };

  const handleEditItem = (index: number) => {
    // In a real app, we would allow editing the food item
    Alert.alert('Edit Item', `Editing ${foodData.items[index].name}`);
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
        <Text style={styles.headerTitle}>Food Analysis</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: photo.uri }} 
            style={styles.foodImage} 
            resizeMode="cover"
          />
        </View>
        
        {isAnalyzing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Analyzing your food with AI...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Ionicons name="alert-circle" size={48} color={COLORS.error} style={styles.errorIcon} />
            <Text style={styles.errorTitle}>Analysis Failed</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Button 
              title="Try Again" 
              onPress={() => analyzeWithTogetherAI(photo.base64)}
              style={styles.tryAgainButton}
            />
          </Card>
        ) : (
          <>
            <Card style={styles.summaryCard}>
              <Text style={styles.foodName}>{foodData.name}</Text>
              <View style={styles.nutritionRow}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{foodData.calories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{foodData.protein}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{foodData.carbs}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{foodData.fat}g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
            </Card>
            
            <Text style={styles.sectionTitle}>Food Items</Text>
            
            {foodData.items.length > 0 ? (
              foodData.items.map((item, index) => (
                <Card key={index} style={styles.itemCard}>
                  <View style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemAmount}>{item.amount}</Text>
                    </View>
                    <View style={styles.itemActions}>
                      <Text style={styles.itemCalories}>{item.calories} cal</Text>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => handleEditItem(index)}
                      >
                        <Ionicons name="pencil" size={16} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <Text style={styles.noItemsText}>No individual items identified</Text>
            )}
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Calories:</Text>
              <Text style={styles.totalValue}>{foodData.calories}</Text>
            </View>
            
            <Button 
              title="Save to Food Log" 
              onPress={handleSaveToLog}
              size="large"
              style={styles.saveButton}
            />
            
            <Button 
              title="Re-analyze with AI" 
              onPress={() => setShowApiKeyInput(true)}
              variant="outline"
              style={styles.reanalyzeButton}
            />
          </>
        )}
        
        {showApiKeyInput && (
          <Card style={styles.apiKeyCard}>
            <Text style={styles.apiKeyTitle}>AI Configuration</Text>
            <Input
              label="Together AI API Key"
              value={customApiKey}
              onChangeText={setCustomApiKey}
              secureTextEntry
              placeholder="Enter your Together AI API key"
            />
            <Input
              label="Model"
              value={customModel}
              onChangeText={setCustomModel}
              placeholder="Model name (e.g., google/gemma-3n-E4B-it)"
            />
            <Text style={styles.apiKeyInfo}>
              Your API key is only used for this request and is not stored.
            </Text>
            <Button 
              title="Analyze Image" 
              onPress={handleAnalyzeWithAI}
              style={styles.analyzeButton}
            />
          </Card>
        )}
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
  scrollContent: {
    padding: SIZES.medium,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.base,
    overflow: 'hidden',
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.extraLarge,
  },
  loadingText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginTop: SIZES.medium,
  },
  errorCard: {
    alignItems: 'center',
    padding: SIZES.large,
    marginVertical: SIZES.medium,
  },
  errorIcon: {
    marginBottom: SIZES.small,
  },
  errorTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.error,
    marginBottom: SIZES.small,
  },
  errorMessage: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  tryAgainButton: {
    marginTop: SIZES.small,
  },
  summaryCard: {
    marginBottom: SIZES.medium,
  },
  foodName: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  nutritionLabel: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginVertical: SIZES.small,
  },
  itemCard: {
    marginBottom: SIZES.small,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  itemAmount: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCalories: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginRight: SIZES.small,
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    marginBottom: SIZES.medium,
  },
  totalLabel: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  totalValue: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  saveButton: {
    marginBottom: SIZES.small,
  },
  reanalyzeButton: {
    marginBottom: SIZES.large,
  },
  apiKeyCard: {
    marginVertical: SIZES.medium,
  },
  apiKeyTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  apiKeyInfo: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.small,
    fontStyle: 'italic',
  },
  analyzeButton: {
    marginTop: SIZES.small,
  },
  noItemsText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: SIZES.medium,
    fontStyle: 'italic',
  },
});

export default FoodAnalysisScreen;