import { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Api } from "../services/api.js";
import { DataTable } from "../components/DataTable.js";
import { SafeAreaView } from "react-native-safe-area-context";

export function ControlScreen() {
  const [thresholdValue, setThresholdValue] = useState(30);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Api.getThresholds();
      setHistory(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory])
  );

  const latestThreshold = useMemo(() => history?.[0]?.value ?? null, [history]);

  const handleSubmit = useCallback(async () => {
    const valueNumber = Number(thresholdValue);
    if (Number.isNaN(valueNumber)) {
      setError("Please enter a numeric threshold.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await Api.createThreshold({ value: valueNumber, note });
      setNote("");
      await fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [thresholdValue, note, fetchHistory]);

  const handleDeleteAll = useCallback(async () => {
    Alert.alert(
      "Hapus Riwayat",
      "Apakah Anda yakin ingin menghapus semua riwayat threshold? Tindakan ini tidak dapat dibatalkan.",
      [
        { text: "Batal", style: "cancel", onPress: () => {} },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            setError(null);
            try {
              await Api.deleteThresholds();
              await fetchHistory(); // Refresh list (akan jadi kosong)
            } catch (err) {
              setError(err.message);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  }, [fetchHistory]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Card 'Configure Threshold' tetap sama */}
          <View style={styles.card}>
            <Text style={styles.title}>Configure Threshold</Text>
            {latestThreshold !== null && (
              <Text style={styles.metaText}>
                Current threshold: {Number(latestThreshold).toFixed(2)}°C
              </Text>
            )}
            <Text style={styles.label}>Threshold (°C)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(thresholdValue)}
              onChangeText={setThresholdValue}
            />
            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              placeholder="Describe why you are changing the threshold"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Threshold</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Perubahan Tata Letak Header:
            - Judul dan Tombol Delete dikelompokkan di kiri.
            - Indikator loading tetap di kanan (sesuai layout 'space-between').
          */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Threshold History</Text>
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  (deleting || loading || history.length === 0) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleDeleteAll}
                disabled={deleting || loading || history.length === 0}
              >
                {deleting ? (
                  <ActivityIndicator color="#c82333" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete All</Text>
                )}
              </TouchableOpacity>
            </View>
            {loading && !deleting && <ActivityIndicator />}
          </View>

          <DataTable
            columns={[
              {
                key: "created_at",
                title: "Saved At",
                render: (value) =>
                  value ? new Date(value).toLocaleString() : "--",
              },
              {
                key: "value",
                title: "Threshold (°C)",
                render: (value) =>
                  typeof value === "number"
                    ? `${Number(value).toFixed(2)}`
                    : "--",
              },
              {
                key: "note",
                title: "Note",
                render: (value) => value || "-",
              },
            ]}
            data={history}
            keyExtractor={(item) => item.id}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 5. Tambahkan style untuk tombol delete
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fb",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  label: {
    marginTop: 16,
    fontWeight: "600",
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  metaText: {
    color: "#666",
  },
  errorText: {
    marginTop: 12,
    color: "#c82333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  // Style baru untuk mengelompokkan judul dan tombol
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#fbebeb", // Latar belakang merah muda
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c82333",
    marginLeft: 12, // Memberi jarak dari judul
  },
  deleteButtonText: {
    color: "#c82333", // Teks merah
    fontWeight: "600",
    fontSize: 14,
  },
});