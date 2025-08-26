import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchGold, fetchSilver, fetchPlatinum, fetchPalladium } from "../src/api/metalsApi";
import Loader from "../src/components/Loader";
import ErrorMessage from "../src/components/ErrorMessage";
import { formatDate, formatTime } from "../src/utils/formatDate";

const MAP = {
  gold: fetchGold,
  silver: fetchSilver,
  platinum: fetchPlatinum,
  palladium: fetchPalladium,
};

export default function DetailsScreen() {
  const { metal } = useLocalSearchParams(); // "gold" | "silver" | ...
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const fn = MAP[metal];
      if (!fn) throw new Error("Unknown metal");
      const res = await fn();
      setRecord(res);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [metal]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{record.name} (24K) — Details</Text>
      <Row label="Current Price (₹/g)" value={record.pricePerGram24k} />
      <Row label="Previous Close (₹/g)" value={record.prevClose} />
      <Row label="Previous Open (₹/g)" value={record.prevOpen} />
      <Row label="Today’s Date" value={formatDate(record.timestamp)} />
      <Row label="Today’s Time" value={formatTime(record.timestamp)} />
      <Row label="Fetched via route" value={record.route} />
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {typeof value === "number" ? `₹ ${value.toLocaleString("en-IN")}` : value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 16 },
  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  label: { fontSize: 13, color: "#666" },
  value: { marginTop: 4, fontSize: 16, fontWeight: "700" },
});
