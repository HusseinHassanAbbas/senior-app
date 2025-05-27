import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function ChangePassword() {
  const navigation = useNavigation();
  const [userID, setuserID] = useState(null);
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('https://seniorproject-1-3rbo.onrender.com/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setuserID(response.data._id);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load user data.');
      }
    };

    loadUser();
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  

  const handleChangePassword = async () => {
    if (form.newPassword !== form.confirm_password) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (form.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.put(
        `https://seniorproject-1-3rbo.onrender.com/api/user/change-password/${userID}`,
        
          form
        ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm(response.data)

      Alert.alert('Success', response.data.message || 'Password changed successfully.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to change password.';
      Alert.alert('Error', msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={form.oldPassword}
        onChangeText={(text) => handleChange('oldPassword', text)}
        placeholder="Enter current password"
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={form.newPassword}
        onChangeText={(text) => handleChange('newPassword', text)}
        placeholder="Enter new password"
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={form.confirm_password}
        onChangeText={(text) => handleChange('confirm_password', text)}
        placeholder="Confirm new password"
      />

      <Button title="Change Password" onPress={handleChangePassword} color="#D32F2F" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF5F5',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
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
