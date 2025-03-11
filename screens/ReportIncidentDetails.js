import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import io from 'socket.io-client';
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import DropdownField from "../components/shared/DropdownField";
import InputField from "../components/shared/InputField";
import CustomButton from "../components/shared/CustomButton";
import BottomNavBar from "../components/shared/BottomNavBar";
import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import api from "../services/api/axiosInstance";
import uuid from 'react-native-uuid';
import * as Location from 'expo-location';

const ReportIncidentDetails = ({ navigation }) => {
  const [incidentType, setIncidentType] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false); // Toggle for current location
  const [errorMsg, setErrorMsg] = useState(null);

  const socket = io('http://10.0.2.2:3000');
  const { user } = useContext(AuthContext);

  // Function to get the current location and reverse geocode it
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    try {
      // Get current coordinates
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get human-readable address
      let address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address.length > 0) {
        const formattedAddress = `${address[0].name}, ${address[0].city}, ${address[0].region}, ${address[0].country}`;
        setLocation(formattedAddress); // Set the formatted address
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg("Unable to fetch location. Please try again.");
    }
  };

  // Automatically fetch location if the user toggles the switch
  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    } else {
      setLocation(""); // Clear the location if the user disables the toggle
    }
  }, [useCurrentLocation]);

  const handleImagePicker = async (source) => {
    let permissionResult;

    if (source === "camera") {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.status !== "granted") {
      alert("You need to grant permissions to use this feature.");
      return;
    }

    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert("Upload Image", "Choose an option", [
      { text: "Camera Roll", onPress: () => handleImagePicker("gallery") },
      { text: "Take a Photo", onPress: () => handleImagePicker("camera") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleDeleteImage = (index) => {
    Alert.alert("Delete Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setImages(images.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const handleSubmitReport = async () => {
    const uniqueId = uuid.v4();

    const reportData = {
      incidentType,
      urgencyLevel,
      location,
      incidentDescription,
      userEmail: user.email,
      uuid: uniqueId,
    };

    socket.emit('incidentReport', reportData);

    try {
      const formData = new FormData();
      formData.append("type", incidentType);
      formData.append("urgencyLevel", urgencyLevel);
      formData.append("location", location);
      formData.append("description", incidentDescription);
      formData.append("userEmail", user.email);
      formData.append("uuid", uniqueId);

      images.forEach((imageUri, index) => {
        formData.append('files', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `incident_image_${index}.jpg`,
        });
      });

      const response = await api.post("/api/incidents/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Report submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Report an Incident</Text>

          <DropdownField
            placeholder="Incident Type Selection"
            options={[
              "Theft",
              "Accident",
              "Fire",
              "Robbery",
              "Assault",
              "Sexual Assault",
              "Other",
            ]}
            selectedValue={incidentType}
            onValueChange={setIncidentType}
            style={styles.dropdown}
          />
          <DropdownField
            placeholder="Urgency Level"
            options={["Urgent", "Medium", "High", "Critical"]}
            selectedValue={urgencyLevel}
            onValueChange={setUrgencyLevel}
            style={styles.dropdown}
          />

          {/* Toggle for using current location */}
          <View style={styles.locationToggleContainer}>
            <Text style={styles.label}>Use Current Location</Text>
            <Switch
              value={useCurrentLocation}
              onValueChange={setUseCurrentLocation}
            />
          </View>

          {/* Location Input */}
          <InputField
            placeholder="Location"
            onChangeText={setLocation}
            value={location}
            style={styles.inputContainer}
            editable={!useCurrentLocation} // Disable editing if using current location
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Upload Photos/Videos of incident</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={showImagePickerOptions}
            >
              {images.length > 0 ? (
                <View style={styles.imagePreviewContainer}>
                  {images.map((img, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Image
                        source={{ uri: img }}
                        style={styles.imagePreview}
                      />
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteImage(index)}
                      >
                        <MaterialIcons name="delete" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.uploadText}>Upload</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.fullWidthContainer}>
            <Text style={styles.label}>Incident Description</Text>
            <InputField
              placeholder="Write additional information..."
              value={incidentDescription}
              onChangeText={setIncidentDescription}
              style={styles.descriptionInput}
              inputStyle={styles.descriptionText}
              multiline={true}
            />
          </View>

          <CustomButton
            title="Send Report"
            onPress={handleSubmitReport}
            style={styles.button}
          />
        </View>
      </ScrollView>

      <BottomNavBar />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: "22%",
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: "5%",
  },
  dropdown: {
    marginBottom: 25,
  },
  inputContainer: {
    width: "85%",
    marginBottom: 25,
  },
  fullWidthContainer: {
    width: "85%",
    marginBottom: 10,
  },
  label: {
    fontSize: 19,
    marginBottom: 10,
    fontWeight: "500",
  },
  uploadBox: {
    height: 100,
    backgroundColor: "#F3F3F3",
    borderRadius: 20,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#9A9A9A",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    color: "#9A9A9A",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 2,
  },
  descriptionInput: {
    height: 140,
    textAlignVertical: "top",
    width: "100%",
  },
  descriptionText: {
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    marginBottom: 30,
  },
  locationToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 20,
  },
});

export default ReportIncidentDetails;