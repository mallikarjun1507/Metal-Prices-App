import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchGold, fetchSilver, fetchPlatinum, fetchPalladium } from "../src/api/metalsApi";
import Loader from "../src/components/Loader";
import ErrorMessage from "../src/components/ErrorMessage";
import { formatFull } from "../src/utils/formatDate";

const METALS = [
  { key: "gold", label: "Gold", fetcher: fetchGold },
  { key: "silver", label: "Silver", fetcher: fetchSilver },
  { key: "platinum", label: "Platinum", fetcher: fetchPlatinum },
  { key: "palladium", label: "Palladium", fetcher: fetchPalladium },
];

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setError("");
    try {
      const results = await Promise.all(METALS.map(m => m.fetcher()));
      const obj = {};
      METALS.forEach((m, i) => (obj[m.key] = results[i]));
      setData(obj);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={METALS}
        keyExtractor={(item) => item.key}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const m = data[item.key];
          return (
            <TouchableOpacity
              style={styles.tile}
              onPress={() =>
                router.push({
                  pathname: "/details",
                  params: { metal: item.key }, // pass metal key; details will refetch
                })
              }
            >
              <Text style={styles.name}>{item.label} (24K)</Text>
              <Text style={styles.price}>₹ {m.pricePerGram24k.toLocaleString("en-IN")}/g</Text>
              <Text style={styles.sub}>Updated: {formatFull(m.timestamp)}</Text>
                  {/*<Text style={styles.route}>Route: {m.route}</Text>*/}
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F9" },
  tile: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 18, fontWeight: "700" },
  price: { marginTop: 4, fontSize: 20, fontWeight: "800" },
  sub: { marginTop: 6, fontSize: 12, color: "#666" },
  route: { marginTop: 4, fontSize: 11, color: "#999" },
});
