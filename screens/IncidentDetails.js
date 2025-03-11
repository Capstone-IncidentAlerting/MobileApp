import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import api from "../services/api/axiosInstance";
import HeaderDetails from "../components/IncidentDetails/HeaderDetails";
import MapSection from "../components/IncidentDetails/MapSection";
import CustomButton from "../components/shared/CustomButton";
import BottomNavBar from "../components/shared/BottomNavBar";

const IncidentDetails = ({ route }) => {
  
  const { incidentId } = route.params;

  const [incidentData, setIncidentData] = useState({
    date: "",
    title: "",
    location: "",
    severity: "",
    description: "",
  });

  // 2. Fetch the incident details from the backend
  useEffect(() => {
    api
      .get(`/api/incidents/all/${incidentId}`)
      .then((response) => {
        // Suppose your backend returns an object like:
        // { id, title, location, severity, description, createdAt }
        const data = response.data;

        // Update local state with the actual data
        setIncidentData({
          date: data.createdAt || "Unknown Date",
          title: data.type || "Unknown",
          location: data.location || "Unknown",
          severity: data.urgencyLevel || "Unknown",
          description: data.description || "No description provided.",
        });
      })
      .catch((error) => {
        console.error("Error fetching incident details:", error);
      });
  }, [incidentId]);

  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header component */}
        <HeaderDetails
          date={incidentData.date}
          title={incidentData.title}
          location={incidentData.location}
          severity={incidentData.severity}
        />

        {/* Map + Description Section */}
        <MapSection description={incidentData.description} />

        <CustomButton
          title="View Incident Content"
          style={styles.contentButton}
          textStyle={styles.contentButtonText}
        />

        {/* Extra space at bottom */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomNavBar style={styles.navBar} />
    </View>
  );
};

export default IncidentDetails;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: "12%",
  },
  contentButton: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    borderColor: "#D23C3C",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  contentButtonText: {
    color: "#D23C3C",
  },
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
