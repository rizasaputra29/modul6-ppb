import { useCallback, useState } from "react";
import {
  ScrollView, View, Text, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useMqttSensor } from "../hooks/useMqttSensor.js";
import { Api } from "../services/api.js";
import { DataTable } from "../components/DataTable.js";
import { SafeAreaView } from "react-native-safe-area-context";

export function MonitoringScreen() {
  const { temperature, timestamp, connectionState, error: mqttError } = useMqttSensor();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // State Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;

  const fetchReadings = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await Api.getSensorReadings(page, LIMIT);
      setReadings(response.data ?? []);
      const total = response.total || 0;
      setTotalPages(Math.ceil(total / LIMIT));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useFocusEffect(
    useCallback(() => {
      fetchReadings();
    }, [fetchReadings])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (page !== 1) setPage(1); 
    else await fetchReadings();
    setRefreshing(false);
  }, [fetchReadings, page]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Suhu Realtime</Text>
          <View style={styles.valueRow}>
            <Text style={styles.temperatureText}>
              {typeof temperature === "number" ? `${temperature.toFixed(2)}°C` : "--"}
            </Text>
          </View>
          <Text style={styles.metaText}>Status MQTT: {connectionState}</Text>
          {timestamp && (
            <Text style={styles.metaText}>Updated: {new Date(timestamp).toLocaleTimeString()}</Text>
          )}
          {mqttError && <Text style={styles.errorText}>Error: {mqttError}</Text>}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riwayat Peringatan</Text>
          {loading && <ActivityIndicator size="small" color="#2563eb" />}
        </View>
        
        {apiError && <Text style={styles.errorText}>Gagal memuat: {apiError}</Text>}
        
        <DataTable
          columns={[
            { key: "recorded_at", title: "Waktu", render: (v) => (v ? new Date(v).toLocaleTimeString() : "--") },
            { key: "temperature", title: "Suhu", render: (v) => typeof v === "number" ? `${v.toFixed(1)}°` : "--" },
            { key: "threshold_value", title: "Batas", render: (v) => typeof v === "number" ? `${v.toFixed(1)}°` : "--" },
          ]}
          data={readings}
          keyExtractor={(item) => item.id}
        />

        {/* Tombol Pagination */}
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
            onPress={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            <Text style={styles.pageBtnText}>Sebelumnya</Text>
          </TouchableOpacity>
          
          <Text style={styles.pageInfo}>{page} / {totalPages || 1}</Text>

          <TouchableOpacity 
            style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
            onPress={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
          >
            <Text style={styles.pageBtnText}>Berikutnya</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb", padding: 16 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 12, marginBottom: 16, elevation: 2 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  valueRow: { flexDirection: "row", alignItems: "flex-end" },
  temperatureText: { fontSize: 48, fontWeight: "700", color: "#ff7a59" },
  metaText: { marginTop: 8, color: "#555" },
  errorText: { marginTop: 8, color: "#c82333" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  paginationContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 30 },
  pageBtn: { backgroundColor: "#fff", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, borderWidth: 1, borderColor: "#d1d5db" },
  pageBtnDisabled: { backgroundColor: "#f3f4f6", opacity: 0.5 },
  pageBtnText: { color: "#374151", fontWeight: "500", fontSize: 14 },
  pageInfo: { color: "#6b7280", fontSize: 14 }
});