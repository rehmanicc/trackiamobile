import React, { useState, useEffect } from 'react';
import { TextInput, View, ImageBackground, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/loginStyles';
import api from '../api/client';

export default function LoginScreen() {
  const [phoneNumber, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '' });
  const { login } = useAuth();

  useEffect(() => { loadContactInfo(); }, []);

  const loadContactInfo = async () => {
  try {
    const resContact = await api.get('/settings/contact');

    setContactInfo({
      phone: resContact.data?.phone || '',
      email: resContact.data?.email || '',
    });
  } catch (err) {
    console.log(
      '❌ CONTACT LOAD ERROR:',
      err?.response?.data || err.message
    );
  }
};
  const handleLogin = async () => {
    try {
      await login(phoneNumber, password);
    } catch (err) {
      Alert.alert('Login Failed', err?.response?.data?.message || err.message);
    }
  };

  return (
    <ImageBackground source={require('../assets/trackia_bg.png')} style={styles.background} resizeMode="cover" imageStyle={{ transform: [{ translateY: -80 }] }}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TextInput placeholder="Phone" placeholderTextColor="#ccc" onChangeText={setPhone} style={styles.input} />
          <TextInput placeholder="Password" secureTextEntry placeholderTextColor="#ccc" onChangeText={setPassword} style={styles.input} />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            {!!contactInfo.phone && <Text style={{ color: '#000000', fontSize: 16, fontWeight: '700', marginBottom: 6 }}>📞 {contactInfo.phone}</Text>}
            {!!contactInfo.email && <Text style={{ color: '#000', fontSize: 14, fontWeight: '700' }}>📧 {contactInfo.email}</Text>}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}