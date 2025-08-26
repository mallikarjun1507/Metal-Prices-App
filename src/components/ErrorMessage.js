import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Oops: {message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.btn} onPress={onRetry}>
          <Text style={styles.btnText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  text: { color: "#C00", fontWeight: "700", marginBottom: 12, textAlign: "center" },
  btn: { backgroundColor: "#222", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  btnText: { color: "#fff", fontWeight: "700" },
});
