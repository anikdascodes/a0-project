import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useAI } from '../context/AIContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get AI configuration from context
  const { apiKey, model, updateConfig } = useAI();
  
  // User profile data
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: '32',
    gender: 'Male',
    height: '180',
    weight: '75',
    goal: '2200',
  });
  
  // Form state for editing
  const [formData, setFormData] = useState({ ...profile });
  const [formApiKey, setFormApiKey] = useState(apiKey);
  const [formModel, setFormModel] = useState(model);
  
  // Update form data when AI context changes
  useEffect(() => {
    setFormApiKey(apiKey);
    setFormModel(model);
  }, [apiKey, model]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const handleSave = () => {
    setProfile(formData);
    updateConfig(formApiKey, formModel);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData({ ...profile });
    setFormApiKey(apiKey);
    setFormModel(model);
    setIsEditing(false);
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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>
        
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {isEditing ? (
            <View>
              <Input
                label="Name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
              />
              <View style={styles.rowInputs}>
                <Input
                  label="Age"
                  value={formData.age}
                  onChangeText={(value) => handleInputChange('age', value)}
                  keyboardType="number-pad"
                  containerStyle={styles.halfInput}
                />
                <Input
                  label="Gender"
                  value={formData.gender}
                  onChangeText={(value) => handleInputChange('gender', value)}
                  containerStyle={styles.halfInput}
                />
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{profile.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profile.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{profile.age} years</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{profile.gender}</Text>
              </View>
            </View>
          )}
        </Card>
        
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          
          {isEditing ? (
            <View>
              <View style={styles.rowInputs}>
                <Input
                  label="Height (cm)"
                  value={formData.height}
                  onChangeText={(value) => handleInputChange('height', value)}
                  keyboardType="number-pad"
                  containerStyle={styles.halfInput}
                />
                <Input
                  label="Weight (kg)"
                  value={formData.weight}
                  onChangeText={(value) => handleInputChange('weight', value)}
                  keyboardType="number-pad"
                  containerStyle={styles.halfInput}
                />
              </View>
              <Input
                label="Daily Calorie Goal"
                value={formData.goal}
                onChangeText={(value) => handleInputChange('goal', value)}
                keyboardType="number-pad"
              />
            </View>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>{profile.height} cm</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>{profile.weight} kg</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>BMI</Text>
                <Text style={styles.infoValue}>
                  {(Number(profile.weight) / Math.pow(Number(profile.height) / 100, 2)).toFixed(1)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Daily Calorie Goal</Text>
                <Text style={styles.infoValue}>{profile.goal} calories</Text>
              </View>
            </View>
          )}
        </Card>
        
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>AI Integration</Text>
          
          {isEditing ? (
            <View>
              <Input
                label="Together AI API Key"
                value={formApiKey}
                onChangeText={setFormApiKey}
                secureTextEntry
                placeholder="Enter your Together AI API key"
              />
              <Input
                label="AI Model"
                value={formModel}
                onChangeText={setFormModel}
                placeholder="Model name (e.g., google/gemma-3n-E4B-it)"
              />
              <Text style={styles.apiKeyInfo}>
                Your API key is stored securely and used for food analysis.
              </Text>
            </View>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Together AI API Key</Text>
                <Text style={styles.infoValue}>
                  {apiKey ? '••••••••••••••••••••••••••' : 'Not set'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>AI Model</Text>
                <Text style={styles.infoValue}>{model}</Text>
              </View>
              <Text style={styles.apiKeyInfo}>
                Your API key is stored securely and used for food analysis.
              </Text>
            </View>
          )}
        </Card>
        
        {isEditing && (
          <Button 
            title="Cancel" 
            onPress={handleCancel}
            variant="outline"
            style={styles.cancelButton}
          />
        )}
        
        {!isEditing && (
          <Button 
            title="Log Out" 
            onPress={() => {/* Handle logout */}}
            variant="secondary"
            style={styles.logoutButton}
          />
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
  editButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
  },
  editButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  avatarText: {
    ...FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.white,
  },
  profileName: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.text,
    marginBottom: SIZES.small / 2,
  },
  profileEmail: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
  sectionCard: {
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: {
    ...FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  apiKeyInfo: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SIZES.small,
  },
  cancelButton: {
    marginBottom: SIZES.medium,
  },
  logoutButton: {
    marginTop: SIZES.medium,
  },
});

export default ProfileScreen;