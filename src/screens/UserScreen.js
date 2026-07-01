// src/screens/UserScreen.js
import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ImageBackground, TextInput } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { fetchUsers, deleteUser } from "../api/users";
import { hasPermission } from "../utils/permissions";
import { PERMISSIONS } from "../constants/permissions";
import styles from "../styles/userStyles";
import { COLORS } from "../styles/commonStyles";

export default function UserScreen() {
  const navigation = useNavigation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  useFocusEffect(useCallback(() => { fetchUsersList(); }, []));

  const fetchUsersList = async () => {
    try {
      const res = await fetchUsers();

      console.log(
        "👥 USERS API",
        (res.data || []).map(u => ({
          id: u._id,
          fullName: u.fullName,
          role: u.role,
        }))
      );

      setUsers(
        (res.data || []).filter(
          u => String(u._id) !== String(currentUser?.id)
        )
      );
    } catch (err) {
      console.log("❌ USER ERROR:", err.response?.data || err.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const query = userSearch.toLowerCase().trim();
    if (!query) return true;
    return user?.fullName?.toLowerCase()?.includes(query) || user?.phoneNumber?.toLowerCase()?.includes(query);
  }).sort((a, b) => {
    const query = userSearch.toLowerCase();
    const aStarts = a?.fullName?.toLowerCase()?.startsWith(query);
    const bStarts = b?.fullName?.toLowerCase()?.startsWith(query);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });

  const handleDelete = (id) => {
    Alert.alert("Delete User", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u._id !== id));
          } catch (err) {
            console.log("❌ DELETE USER ERROR:", err.response?.data || err.message);
          }
        }
      },
    ]);
  };

  return (
    <ImageBackground source={require("../assets/trackia_bg.png")} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput placeholder="Search user by name or phone" placeholderTextColor="#94A3B8" value={userSearch} onChangeText={setUserSearch} style={styles.searchInput} />
          </View>
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={styles.cardRow}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.title}>{item?.fullName || ""}</Text>
                  <Text style={styles.subText}>
                    {(item?.role || "").toUpperCase()}
                  </Text>
                </View>
                <View style={styles.actionColumn}>
                  {hasPermission(currentUser, PERMISSIONS.MANAGE_DEVICES) && (
                    <TouchableOpacity style={[styles.iconBtn, styles.iconAssign]} onPress={() => navigation.navigate("AssignDevices", { user: item })}>
                      <Ionicons name="person-add-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {hasPermission(currentUser, PERMISSIONS.MANAGE_USERS) && (
                    <TouchableOpacity style={[styles.iconBtn, styles.iconEdit]} onPress={() => navigation.navigate("User", { user: item })}>
                      <Ionicons name="create-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {hasPermission(currentUser, PERMISSIONS.MANAGE_USERS) && (
                    <TouchableOpacity style={[styles.iconBtn, styles.iconDelete]} onPress={() => handleDelete(item._id)}>
                      <Ionicons name="trash-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {currentUser?.role === "platform_owner" && (
                    <TouchableOpacity style={[styles.iconBtn, styles.iconPermission]} onPress={() => navigation.navigate("UserPermissions", { user: item })}>
                      <Ionicons name="briefcase-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          />
          {hasPermission(currentUser, PERMISSIONS.MANAGE_USERS) && (
            <View style={styles.fabContainer}>
              <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("User")}>
                <Text style={styles.fabText}>+ User</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}