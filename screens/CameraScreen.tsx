import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import Button from '../components/Button';

// Mock ImagePicker for environments where it's not available
const ImagePicker = {
  MediaTypeOptions: {
    Images: 'images',
  },
  requestMediaLibraryPermissionsAsync: async () => ({ status: 'granted' }),
  launchImageLibraryAsync: async (options: any) => {
    // This is a mock implementation for web
    return new Promise((resolve) => {
      // Create a file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) {
          resolve({ canceled: true, assets: [] });
          return;
        }
        
        // Create a URL for the selected file
        const uri = URL.createObjectURL(file);
        
        // Convert file to base64 if requested
        let base64 = null;
        if (options.base64) {
          try {
            const reader = new FileReader();
            base64 = await new Promise((resolve, reject) => {
              reader.onload = () => {
                // Get the base64 string by removing the data URL prefix
                const result = reader.result as string;
                const base64Data = result.split(',')[1];
                resolve(base64Data);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          } catch (error) {
            console.error('Error converting file to base64:', error);
          }
        }
        
        // Create a mock result similar to expo-image-picker
        resolve({
          canceled: false,
          assets: [
            {
              uri,
              width: 800,
              height: 600,
              base64, // Now we're setting the base64 data
            }
          ]
        });
      };
      
      // Trigger the file selection dialog
      input.click();
    });
  }
};

// Define fallback constants in case Camera.Constants is undefined
const CameraTypes = {
  back: 'back',
  front: 'front'
};

const FlashModes = {
  on: 'on',
  off: 'off'
};

const CameraScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // Use fallback constants if Camera.Constants is undefined
  const [type, setType] = useState(Camera.Constants?.Type?.back || CameraTypes.back);
  const [flash, setFlash] = useState(Camera.Constants?.FlashMode?.off || FlashModes.off);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          skipProcessing: Platform.OS === 'android', // Skip processing on Android for speed
        });
        
        // Navigate to analysis screen with the photo data
        navigation.navigate('FoodAnalysis' as never, { photo } as never);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant access to your photo library to upload images.');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        
        // Create a photo object similar to what Camera.takePictureAsync returns
        const photo = {
          uri: selectedAsset.uri,
          width: selectedAsset.width || 800,
          height: selectedAsset.height || 600,
          base64: selectedAsset.base64,
        };
        
        // Navigate to analysis screen with the photo data
        navigation.navigate('FoodAnalysis' as never, { photo } as never);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const toggleCameraType = () => {
    if (Camera.Constants?.Type) {
      setType(
        type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    } else {
      setType(
        type === CameraTypes.back
          ? CameraTypes.front
          : CameraTypes.back
      );
    }
  };

  const toggleFlash = () => {
    if (Camera.Constants?.FlashMode) {
      setFlash(
        flash === Camera.Constants.FlashMode.off
          ? Camera.Constants.FlashMode.on
          : Camera.Constants.FlashMode.off
      );
    } else {
      setFlash(
        flash === FlashModes.off
          ? FlashModes.on
          : FlashModes.off
      );
    }
  };

  // Check if camera is available in this environment
  const isCameraAvailable = !!Camera.Constants;
  
  if (!isCameraAvailable) {
    return (
      <SafeAreaView style={styles.uploadContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Food Image</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.uploadContent}>
          <View style={styles.uploadImageContainer}>
            <Ionicons name="images-outline" size={80} color={COLORS.primary} />
            <Text style={styles.uploadText}>
              Camera is not available on this device
            </Text>
            <Text style={styles.uploadSubText}>
              You can upload an image from your device instead
            </Text>
          </View>
          
          <Button 
            title="Select Image from Gallery" 
            onPress={pickImage}
            style={styles.uploadButton}
            icon="image"
          />
          
          <Button 
            title="Go Back" 
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.backToHomeButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.uploadContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Camera Access</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.uploadContent}>
          <View style={styles.uploadImageContainer}>
            <Ionicons name="camera-off-outline" size={80} color={COLORS.error} />
            <Text style={styles.permissionText}>No access to camera</Text>
            <Text style={styles.permissionSubText}>
              CalorieScan needs camera access to analyze your food.
            </Text>
          </View>
          
          <Button 
            title="Grant Camera Permission" 
            onPress={() => Camera.requestCameraPermissionsAsync()}
            style={styles.permissionButton}
          />
          
          <Text style={styles.orText}>OR</Text>
          
          <Button 
            title="Select Image from Gallery" 
            onPress={pickImage}
            variant="outline"
            style={styles.uploadButton}
            icon="image"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flashMode={flash}
        onCameraReady={handleCameraReady}
        ratio="16:9"
      >
        <SafeAreaView style={styles.cameraContainer}>
          <View style={styles.topControls}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={toggleFlash}
            >
              <Ionicons 
                name={flash === (Camera.Constants?.FlashMode?.on || FlashModes.on) ? "flash" : "flash-off"} 
                size={24} 
                color={COLORS.white} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.captureContainer}>
            <View style={styles.captureInstructions}>
              <Text style={styles.captureText}>
                Position your food in the frame
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
              disabled={!isCameraReady}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.flipButton} 
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={30} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.galleryButton}
            onPress={pickImage}
          >
            <Ionicons name="images" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SIZES.large,
    paddingHorizontal: SIZES.medium,
  },
  captureInstructions: {
    position: 'absolute',
    top: -80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.base,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    position: 'absolute',
    bottom: SIZES.large * 2,
    right: SIZES.medium,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
    backgroundColor: COLORS.background,
  },
  permissionText: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  permissionSubText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: SIZES.large,
    color: COLORS.textSecondary,
  },
  permissionButton: {
    width: '80%',
    marginBottom: SIZES.medium,
  },
  uploadContainer: {
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
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  uploadContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  uploadImageContainer: {
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  uploadText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SIZES.medium,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  uploadSubText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  uploadButton: {
    width: '80%',
    marginBottom: SIZES.medium,
  },
  backToHomeButton: {
    width: '80%',
  },
  orText: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginVertical: SIZES.small,
  },
});

export default CameraScreen;