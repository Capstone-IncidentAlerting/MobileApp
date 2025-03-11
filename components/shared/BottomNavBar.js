import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const BottomNavBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Leftmost Section (Home & Map) */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate("TestAxiosScreen")}
          style={styles.navItem}
        >
          <Image
            source={require("../../assets/icons/home-icon.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Home</Text>
        </TouchableOpacity>
        <View style={{ width: 30 }} /> {/* Space between Home & Map */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Map")}
          style={styles.navItem}
        >
          <Image
            source={require("../../assets/icons/map-icon.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Center Button (with Image) */}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ReportIncident")}
          style={styles.centerButton}
        >
          <Image
            source={require("../../assets/icons/plus-icon.png")}
            style={styles.plusIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Rightmost Section (List & Profile) */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate("IncidentList")}
          style={styles.navItem}
        >
          <Image
            source={require("../../assets/icons/list-icon.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>List</Text>
        </TouchableOpacity>
        <View style={{ width: 30 }} /> {/* Space between List & Profile */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.navItem}
        >
          <Image
            source={require("../../assets/icons/profile-icon.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: width,
    height: 110, // Slightly increased for better spacing
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingHorizontal: 50, // Ensures equal spacing from left and right sides
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Move Home & Map to the left
    width: "40%", // Ensure space distribution is equal on both sides
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Move List & Profile to the right
    width: "40%", // Ensure space distribution is equal on both sides
  },
  navItem: {
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    tintColor: "#9A9A9A",
  },
  text: {
    fontSize: 12,
    color: "#9A9A9A",
    marginTop: 4,
  },
  centerButtonWrapper: {
    position: "absolute",
    bottom: 30, // Keeps it slightly above navbar
    alignSelf: "center",
    left: width / 2 - 32.5, // Adjust centering for button size
  },
  centerButton: {
    width: 65, // Slightly bigger button
    height: 65, // Slightly bigger button
    borderRadius: 32.5, // Perfect circle
    backgroundColor: "#D23C3C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  plusIcon: {
    width: 30, // Adjust size of plus icon
    height: 30,
    resizeMode: "contain",
    tintColor: "#fff", // Keeps it visible if necessary
  },
});

export default BottomNavBar;
