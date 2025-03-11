import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axiosInstance from "../config/axiosInstance"; // your axios config

const TestScreen = () => {
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/incidents/testHello") // hits /api/incidents/testHello on your backend
      .then((response) => {
        setServerMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setServerMessage("Error fetching data");
      });
  }, []);

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text>Server Response: {serverMessage}</Text>
    </View>
  );
};

export default TestScreen;
