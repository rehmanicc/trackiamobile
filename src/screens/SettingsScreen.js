<<<<<<< HEAD
=======
// src/screens/SettingsScreen.js
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateUser } from "../api/users";
<<<<<<< HEAD
import { changePassword } from "../api/auth"; // ✅ new import
=======
import { fetchCurrentUser, updateUserAlertPreferences } from "../api/users"; // for alert prefs
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
import AlertPreferencesPanel from "../components/settings/AlertPreferencesPanel";
import settingsStyles from "../styles/settingsStyles";
import api from "../api/client";

export default function SettingsScreen() {
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "platform_owner" || user?.role === "admin";
  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("contact");
<<<<<<< HEAD
  const [currentPassword, setCurrentPassword] = useState("");   // ✅ new state
=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactInfo, setContactInfo] = useState({ phone: "", email: "", website: "", address: "" });

  // Load contact info (from public settings endpoint – keep as is)
  useEffect(() => {
    if (activeSection === "contact") loadContactInfo();
  }, [activeSection]);

  const loadContactInfo = async () => {
    try {
      const res = await api.get("/settings/contact");
      setContactInfo(res.data);
    } catch (err) {
      console.log("❌ CONTACT LOAD ERROR:", err.message);
    }
  };

  const handleChange = (key, value) => setContactInfo(prev => ({ ...prev, [key]: value }));

  const handleSaveContact = async () => {
    try {
<<<<<<< HEAD
      await api.put("/settings/contact", contactInfo);
=======
     await api.put("/settings/contact", contactInfo);
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
      setEditing(false);
      Alert.alert("Success", "Contact information updated");
    } catch (err) {
      console.log("❌ CONTACT SAVE ERROR:", err.message);
      Alert.alert("Error", "Failed to update contact info");
    }
  };

<<<<<<< HEAD
  // ✅ Updated password change handler using dedicated endpoint
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "All fields are required");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert("Success", "Password updated successfully");
      setCurrentPassword("");
=======
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) return Alert.alert("Error", "All fields required");
    if (newPassword !== confirmPassword) return Alert.alert("Error", "Passwords do not match");
    try {
      // ✅ FIXED: Use updateUser endpoint to change password
      await updateUser(user._id, { password: newPassword });
      Alert.alert("Success", "Password updated successfully");
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
      setNewPassword("");
      setConfirmPassword("");
      setActiveSection("contact");
    } catch (err) {
      console.log("❌ PASSWORD ERROR:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "Password update failed");
    }
  };

  const faqs = [
    { question: "How does Geofence work?", answer: "Trackia supports polygon and circle geofences. When a vehicle enters or exits a geofence area, realtime alerts are generated instantly." },
    { question: "Why is my vehicle not updating live location?", answer: "Vehicle updates depend on GPS signal, tracker internet connectivity, and Traccar communication." },
    { question: "What are device settings used for?", answer: "Device settings allow administrators to configure speed limits, SIM numbers, oil change readings, and fuel efficiency." },
    { question: "How do alerts work?", answer: "Trackia automatically generates alerts for overspeed, geofence events, ignition activity, and critical tracker events." },
  ];

  return (
    <ImageBackground source={require("../assets/trackia_bg.png")} style={settingsStyles.background} resizeMode="cover">
      <View style={settingsStyles.overlay}>
        <ScrollView style={settingsStyles.container} showsVerticalScrollIndicator={false}>
          <View style={settingsStyles.header}>
            <View>
              <Text style={settingsStyles.title}>{user?.name || "Settings"}</Text>
              <Text style={settingsStyles.subtitle}>{(user?.role || "user").toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={settingsStyles.logoutPill} onPress={logout}>
              <Ionicons name="log-out-outline" size={16} color="#fff" />
              <Text style={settingsStyles.logoutPillText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={settingsStyles.topButtons}>
<<<<<<< HEAD
            <TouchableOpacity
              style={[settingsStyles.topButton, activeSection === "alerts" && settingsStyles.topButtonActive]}
              onPress={() => setActiveSection("alerts")}
            >
              <Ionicons name="notifications-outline" size={18} color="#fff" />
              <Text style={settingsStyles.topButtonText}>Alerts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[settingsStyles.topButton, activeSection === "contact" && settingsStyles.topButtonActive]}
              onPress={() => setActiveSection("contact")}
            >
              <Ionicons name="call-outline" size={18} color="#fff" />
              <Text style={settingsStyles.topButtonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[settingsStyles.topButton, activeSection === "faq" && settingsStyles.topButtonActive]}
              onPress={() => setActiveSection("faq")}
            >
              <Ionicons name="help-circle-outline" size={18} color="#fff" />
              <Text style={settingsStyles.topButtonText}>FAQs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[settingsStyles.topButton, activeSection === "password" && settingsStyles.topButtonActive]}
              onPress={() => setActiveSection("password")}
            >
=======
            <TouchableOpacity style={[settingsStyles.topButton, activeSection === "alerts" && settingsStyles.topButtonActive]} onPress={() => setActiveSection("alerts")}>
              <Ionicons name="notifications-outline" size={18} color="#fff" />
              <Text style={settingsStyles.topButtonText}>Alerts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingsStyles.topButton, activeSection === "contact" && settingsStyles.topButtonActive]} onPress={() => setActiveSection("contact")}>
              <Ionicons name="call-outline" size={18} color="#fff" />
              <Text style={settingsStyles.topButtonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingsStyles.topButton, activeSection === "faq" && settingsStyles.topButtonActive]} onPress={() => setActiveSection("faq")}>
              <Ionicons name="help-circle-outline" size={18} color="#fff" />
              <Text style={settingsStyles.topButtonText}>FAQs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingsStyles.topButton, activeSection === "password" && settingsStyles.topButtonActive]} onPress={() => setActiveSection("password")}>
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
              <Ionicons name="lock-closed-outline" size={18} color="#fff" />
              <Text style={settingsStyles.topButtonText}>Password</Text>
            </TouchableOpacity>
          </View>

          {activeSection === "alerts" && <AlertPreferencesPanel />}

          {activeSection === "contact" && (
            <View style={settingsStyles.card}>
              <View style={settingsStyles.cardHeader}>
                <Text style={settingsStyles.cardTitle}>Contact Information</Text>
<<<<<<< HEAD
                {isAdmin && !editing && (
                  <TouchableOpacity onPress={() => setEditing(true)}>
                    <Text style={settingsStyles.editText}>Edit</Text>
                  </TouchableOpacity>
                )}
=======
                {isAdmin && !editing && <TouchableOpacity onPress={() => setEditing(true)}><Text style={settingsStyles.editText}>Edit</Text></TouchableOpacity>}
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
              </View>
              {[
                ["Phone", "phone", "📞"],
                ["Email", "email", "📧"],
                ["Website", "website", "🌐"],
                ["Address", "address", "📍"],
              ].map(([label, key, icon]) => (
                <View key={key}>
                  <Text style={settingsStyles.label}>{label}</Text>
                  {editing ? (
<<<<<<< HEAD
                    <TextInput
                      value={contactInfo[key]}
                      onChangeText={v => handleChange(key, v)}
                      style={settingsStyles.input}
                    />
=======
                    <TextInput value={contactInfo[key]} onChangeText={v => handleChange(key, v)} style={settingsStyles.input} />
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
                  ) : (
                    <View style={settingsStyles.valueBox}>
                      <Text style={settingsStyles.valueText}>{icon} {contactInfo[key]}</Text>
                    </View>
                  )}
                </View>
              ))}
<<<<<<< HEAD
              {editing && (
                <TouchableOpacity style={settingsStyles.saveButton} onPress={handleSaveContact}>
                  <Text style={settingsStyles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              )}
=======
              {editing && <TouchableOpacity style={settingsStyles.saveButton} onPress={handleSaveContact}><Text style={settingsStyles.saveButtonText}>Save Changes</Text></TouchableOpacity>}
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
            </View>
          )}

          {activeSection === "password" && (
            <View style={settingsStyles.card}>
              <Text style={settingsStyles.cardTitle}>Change Password</Text>
<<<<<<< HEAD

              {/* ✅ Current Password field added */}
              <Text style={settingsStyles.label}>Current Password</Text>
              <TextInput
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                style={settingsStyles.input}
                placeholder="Enter current password"
                placeholderTextColor="#999"
              />

              <Text style={settingsStyles.label}>New Password</Text>
              <TextInput
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                style={settingsStyles.input}
                placeholder="Enter new password"
                placeholderTextColor="#999"
              />

              <Text style={settingsStyles.label}>Confirm Password</Text>
              <TextInput
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={settingsStyles.input}
                placeholder="Confirm password"
                placeholderTextColor="#999"
              />

              <TouchableOpacity style={settingsStyles.saveButton} onPress={handleChangePassword}>
                <Text style={settingsStyles.saveButtonText}>Update Password</Text>
              </TouchableOpacity>
=======
              <Text style={settingsStyles.label}>New Password</Text>
              <TextInput secureTextEntry value={newPassword} onChangeText={setNewPassword} style={settingsStyles.input} placeholder="Enter new password" placeholderTextColor="#999" />
              <Text style={settingsStyles.label}>Confirm Password</Text>
              <TextInput secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={settingsStyles.input} placeholder="Confirm password" placeholderTextColor="#999" />
              <TouchableOpacity style={settingsStyles.saveButton} onPress={handleChangePassword}><Text style={settingsStyles.saveButtonText}>Update Password</Text></TouchableOpacity>
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
            </View>
          )}

          {activeSection === "faq" && (
            <View style={settingsStyles.card}>
              <Text style={settingsStyles.cardTitle}>Frequently Asked Questions</Text>
              {faqs.map((faq, index) => (
                <View key={index} style={settingsStyles.faqItem}>
                  <Text style={settingsStyles.faqQuestion}>{faq.question}</Text>
                  <Text style={settingsStyles.faqAnswer}>{faq.answer}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}