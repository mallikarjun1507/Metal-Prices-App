import { StyleSheet } from "react-native";

export default StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F7F9" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: { fontSize: 20, fontWeight: "800" },
});
