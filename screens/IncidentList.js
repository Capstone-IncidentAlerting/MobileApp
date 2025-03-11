import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import api from "../services/api/axiosInstance";
import FilterTabs from "../components/IncidentList/FilterTabs";
import IncidentCard from "../components/IncidentList/IncidentCard";
import BottomNavBar from "../components/shared/BottomNavBar";

const filters = ["All", "Most Urgent", "Pending"];

const IncidentList = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [incidents, setIncidents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    api
      .get("/api/incidents/verified") // Fetch only verified incidents
      .then((response) => {
        setIncidents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching incidents:", error);
        setErrorMessage("Could not load incidents.");
      });
  }, []);

  // **Sorting Function for Most Urgent**
  const urgencyOrder = {
    Urgent: 1,
    Moderate: 2,
    Low: 3,
  };

  const getFilteredIncidents = () => {
    if (selectedFilter === "All") {
      return incidents; // No sorting, return all
    }
    if (selectedFilter === "Most Urgent") {
      return [...incidents].sort(
        (a, b) => urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel]
      );
    }
    if (selectedFilter === "Pending") {
      return incidents.filter((incident) => incident.status === "Pending");
    }
    return incidents; // Default return
  };

  const renderIncidentItem = ({ item }) => (
    <IncidentCard
      id={item.uuid}
      icon={require("../assets/icons/home-icon.png")}
      incidentType={item.type || "Unknown"}
      location={item.location || "Unknown"}
      dateTime={item.createdAt || "Unknown"}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Incident List</Text>

        {/* Filter Tabs */}
        <View style={styles.filterTabsContainer}>
          <FilterTabs
            filters={filters}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />
        </View>

        {/* Error or Incident List */}
        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : (
          <FlatList
            data={getFilteredIncidents()} // Sorted and filtered data
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderIncidentItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </View>
  );
};

export default IncidentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  error: {
    marginTop: 20,
    color: "red",
    textAlign: "center",
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: "56%", // Prevent overlap with BottomNavBar
  },
});
