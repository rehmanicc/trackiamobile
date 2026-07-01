import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, Switch } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createTrackerModel, updateTrackerModel } from "../api/trackers";
import FormField from "../components/common/FormField";
import styles from "../styles/FormStyles";

export default function TrackerModelFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const tracker = route.params?.tracker || null;
  const isEdit = !!tracker;

  const [form, setForm] = useState({
    name: "", brand: "", protocol: "custom", engineStopCommand: "", engineResumeCommand: "",
  });
  const [supportsEngineControl, setSupportsEngineControl] = useState(false);

  useEffect(() => {
    if (tracker) {
      setForm({
        name: tracker.name || "", brand: tracker.brand || "", protocol: tracker.protocol || "custom",
        engineStopCommand: tracker.engineStopCommand || "", engineResumeCommand: tracker.engineResumeCommand || "",
      });
      setSupportsEngineControl(tracker.supportsEngineControl || false);
    }
  }, [tracker]);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) return Alert.alert("Validation", "Model name required");
    if (!form.brand.trim()) return Alert.alert("Validation", "Brand required");
    try {
      const payload = { ...form, supportsEngineControl };
      if (isEdit) {
        await updateTrackerModel(tracker._id, payload);
      } else {
        await createTrackerModel(payload);
      }
      Alert.alert("Success", isEdit ? "Tracker updated" : "Tracker model created");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err?.response?.data?.error || "Failed to save tracker model");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{isEdit ? "Edit Tracker" : "Add Tracker"}</Text>
        <Text style={styles.subtitle}>Manage tracker protocols and commands</Text>
        <View style={styles.card}>
          <FormField label="Brand" value={form.brand} onChange={v => handleChange("brand", v)} placeholder="ATS" />
          <FormField label="Model" value={form.name} onChange={v => handleChange("name", v)} placeholder="ATS-GO" />
          <FormField label="Protocol" value={form.protocol} onChange={v => handleChange("protocol", v)} placeholder="custom" />
          <View style={{ marginTop: 10, marginBottom: 16 }}>
            <Text style={{ marginBottom: 8, fontWeight: "600" }}>Supports Engine Control</Text>
            <Switch value={supportsEngineControl} onValueChange={setSupportsEngineControl} />
          </View>
          <FormField label="Engine Stop Command" value={form.engineStopCommand} onChange={v => handleChange("engineStopCommand", v)} placeholder="RELAY,1#" />
          <FormField label="Engine Resume Command" value={form.engineResumeCommand} onChange={v => handleChange("engineResumeCommand", v)} placeholder="RELAY,0#" />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{isEdit ? "Update Tracker" : "Create Tracker"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}