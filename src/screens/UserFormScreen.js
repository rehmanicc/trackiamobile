// src/screens/UserFormScreen.js
import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { fetchUsers, createUser, updateUser } from "../api/users";
import FormField from "../components/common/FormField";
import styles from "../styles/FormStyles";
import { registerPlatformOwner } from "../api/auth";

export default function UserFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user: currentUser } = useAuth();
  const user = route.params?.user || null;
  const isEdit = !!user;

  const [admins, setAdmins] = useState([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    role: "user",
    adminId: "",
  });

  useEffect(() => {
    if (isEdit && user) {
      setForm({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        password: "",
        role: user.role || "user",
        adminId: user.adminId || "",
      });
    }
  }, [user]);

  // Load admins (platform_owner only)
  useEffect(() => {
    if (currentUser?.role === "platform_owner") {
      const loadAdmins = async () => {
        try {
          const res = await fetchUsers();
          setAdmins((res.data || []).filter(u => u.role === "admin"));
        } catch (err) {
          console.log("❌ LOAD ADMINS:", err.response?.data || err.message);
        }
      };
      loadAdmins();
    }
  }, [currentUser]);

  const filteredAdmins = admins.filter(
    a => a.fullName?.toLowerCase()?.includes(adminSearch.toLowerCase())
  );

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (
        currentUser?.role === "platform_owner" &&
        form.role === "user" &&
        !form.adminId
      ) {
        return Alert.alert(
          "Validation",
          "Please select an admin for this user"
        );
      }

      if (!form.name || !form.phoneNumber || !form.password) {
        return Alert.alert(
          "Validation",
          "Name, phone number and password are required"
        );
      }

      if (isEdit) {
        await updateUser(user._id, {
          fullName: form.name,
          phoneNumber: form.phoneNumber,
          role: form.role,
          adminId: form.adminId,
        });
      } else {
        // Platform Owner creating Admin
        if (
          currentUser?.role === "platform_owner" &&
          form.role === "admin"
        ) {
          await registerPlatformOwner({
            fullName: form.name,
            phoneNumber: form.phoneNumber,
            password: form.password,
            role: "admin",
          });
        } else {
          // Create User
          await createUser({
            fullName: form.name,
            phoneNumber: form.phoneNumber,
            password: form.password,
            adminId:
              currentUser?.role === "platform_owner"
                ? form.adminId
                : currentUser?.id,
          });
        }
      }

      Alert.alert(
        "Success",
        isEdit
          ? "User updated successfully"
          : "User created successfully"
      );

      navigation.goBack();
    } catch (err) {
      console.log(
        "❌ USER ERROR:",
        err.response?.data || err.message
      );

      Alert.alert(
        "Error",
        err.response?.data?.error || "Operation failed"
      );
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{isEdit ? "Edit User" : "Add User"}</Text>
        <Text style={styles.subtitle}>Manage user access and permissions</Text>

        <View style={styles.card}>
          <FormField label="Name" value={form.name} onChange={v => handleChange("name", v)} placeholder="Enter name" />
          <FormField label="Phone Number" value={form.phoneNumber} onChange={v => handleChange("phoneNumber", v)} placeholder="Enter phone number" />
          <FormField label="Password" value={form.password} onChange={v => handleChange("password", v)} placeholder="Enter password" secureTextEntry />

          {currentUser?.role === "platform_owner" && (
            <>
              <Text style={styles.label}>Select Role</Text>
              <View style={styles.roleRow}>
                {["admin", "user"].map(r => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => handleChange("role", r)}
                    style={[styles.roleBtn, form.role === r && styles.roleBtnActive]}
                  >
                    <Text style={styles.roleBtnText}>{r.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {form.role === "user" && (
                <>
                  <Text style={styles.label}>Select Admin</Text>
                  <TouchableOpacity activeOpacity={1} onPress={() => setShowAdminDropdown(!showAdminDropdown)} style={styles.dropdownSelector}>
                    <Text style={styles.dropdownText}>
                      {admins.find(a => a._id === form.adminId)?.fullName || "Choose Admin"}
                    </Text>
                  </TouchableOpacity>
                  {showAdminDropdown && (
                    <View style={styles.dropdownContainer}>
                      <TextInput placeholder="Search admin..." placeholderTextColor="#888" value={adminSearch} onChangeText={setAdminSearch} style={styles.dropdownSearch} />
                      <ScrollView>
                        {filteredAdmins.map(admin => (
                          <TouchableOpacity
                            key={admin._id}
                            onPress={() => {
                              handleChange("adminId", admin._id);
                              setAdminSearch("");
                              setShowAdminDropdown(false);
                            }}
                            style={styles.dropdownItem}
                          >
                            <Text style={styles.dropdownItemText}>{admin.fullName}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{isEdit ? "Update User" : "Create User"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}