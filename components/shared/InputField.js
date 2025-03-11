import React from "react";
import { TextInput, StyleSheet, View } from "react-native";

const InputField = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  style,
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {" "}
      {/* Apply dynamic styles */}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9A9A9A"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "85%",
    height: 60,
    backgroundColor: "#F3F3F3",
    borderRadius: 20, // Rounded Borders
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  input: {
    fontSize: 18,
    color: "#9A9A9A",
    paddingLeft: 10,
  },
});

export default InputField;
