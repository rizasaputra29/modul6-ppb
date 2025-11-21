import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";

export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fb" }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.uid}>User ID: {user?.id?.slice(0,8)}...</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Akun Terverifikasi</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Keluar (Logout)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  card: {
    backgroundColor: "#fff", width: "100%", padding: 24, borderRadius: 16, alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 24
  },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#e0e7ff", justifyContent: "center", alignItems: "center", marginBottom: 16
  },
  avatarText: { fontSize: 32, fontWeight: "bold", color: "#3730a3" },
  email: { fontSize: 18, fontWeight: "bold", color: "#1f2937", marginBottom: 4 },
  uid: { fontSize: 12, color: "#6b7280", marginBottom: 16 },
  badge: { backgroundColor: "#d1fae5", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: "#065f46", fontSize: 12, fontWeight: "600" },
  logoutBtn: {
    width: "100%", backgroundColor: "#fee2e2", padding: 14, borderRadius: 8, alignItems: "center", borderWidth: 1, borderColor: "#ef4444"
  },
  logoutText: { color: "#b91c1c", fontWeight: "600", fontSize: 16 }
});