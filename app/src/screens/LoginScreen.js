import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform 
} from "react-native";
import { useAuth } from "../context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, continueAsGuest } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Login Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image source={require("../../assets/icon.png")} style={styles.logo} resizeMode="contain"/>
          <Text style={styles.title}>IOTWatch</Text>
          <Text style={styles.subtitle}>Monitoring & Kontrol Suhu</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="email@example.com" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="********" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
          
          <TouchableOpacity style={styles.btnLogin} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Masuk</Text>}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ATAU</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.btnGuest} onPress={continueAsGuest}>
            <Text style={styles.btnGuestText}>Lanjut Tanpa Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  logo: { width: 80, height: 80, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1f2937" },
  subtitle: { fontSize: 16, color: "#6b7280", marginTop: 4 },
  form: { width: "100%" },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: { 
    borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, backgroundColor: "#f9fafb" 
  },
  btnLogin: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  dividerText: { marginHorizontal: 16, color: "#9ca3af", fontSize: 12, fontWeight: "600" },
  btnGuest: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#2563eb", padding: 14, borderRadius: 8, alignItems: "center" },
  btnGuestText: { color: "#2563eb", fontWeight: "600", fontSize: 16 }
});