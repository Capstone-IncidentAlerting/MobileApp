import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// Replace this placeholder with your actual map or local asset.
import mapPlaceholder from "../../assets/icons/home-icon.png";

const MapSection = ({ mapImage = mapPlaceholder, description = "" }) => {
  return (
    <View style={styles.outerContainer}>
      {/* Card for the map with its own shadow and rounded corners */}
      <View style={styles.mapCard}>
        <View style={styles.mapInner}>
          <Image source={mapImage} style={styles.mapImage} />
        </View>
      </View>

      {/* Description Section below the map card */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Incident Description</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    </View>
  );
};

export default MapSection;

const styles = StyleSheet.create({
  /**
   * The outer container: big card that wraps everything.
   * Has its own rounded corners & shadow.
   */
  outerContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    // Shadow on iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Elevation on Android
    elevation: 3,
    // Do NOT use overflow: "hidden" here so the outer shadow is visible
  },

  /**
   * A second "card" specifically for the map
   * so it can have its own border, shadow, etc.
   */
  mapCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    // Slightly smaller shadow, so it looks inset
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
    // Do NOT use overflow: "hidden" here so the mapCard's shadow is visible
  },

  /**
   * Inner container that clips the map image corners
   * but does not have the shadow (so it's fully rounded).
   */
  mapInner: {
    borderRadius: 12,
    overflow: "hidden", // ensures image corners are rounded
  },
  mapImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },

  /**
   * Description area is still within the outerContainer.
   * It appears below the mapCard.
   */
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 18,
  },
});
