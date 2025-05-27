import React, { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Alert
} from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post('https://seniorproject-1-3rbo.onrender.com/api/login', {
        email,
        password,
      });

      const token = response.data.token;

      if (token) {
  await AsyncStorage.setItem('userToken', token);
  await AsyncStorage.setItem('userEmail', email);

  const stored = await AsyncStorage.getItem('userToken');
  const storedEmail = await AsyncStorage.getItem('userEmail');

  console.log('Token after storing:', stored); // Just to be safe
  console.log('Email:', storedEmail);
  
  router.push('/App'); // only navigate after confirming
}
 else {
        Alert.alert("Login Failed", "No token received from server.");
      }

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert("Login Failed", error.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="Login"
        onPress={handleLogin}
        color="#D32F2F"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
  padding: 20,
  paddingBottom: 180, // 👈 Add this
  backgroundColor: '#FFF5F5',
  flexGrow: 1,
  justifyContent: 'center',
},

  heading: {
    fontSize: 28,
    marginBottom: 20,
    color: '#D32F2F',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
