import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function EditProfile() {
  const navigation = useNavigation();
  const [userID,setUserID] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    blood_type: '',
    address: '',
    last_donation_date:''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('https://seniorproject-1-3rbo.onrender.com/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm({
          name: response.data.name || '',
          // email: 'abbass@gmail.com',
          phone_number: response.data.phone_number || '',
          date_of_birth: response.data.date_of_birth.slice(0,10) || '',
          gender: response.data.gender || '',
          blood_type: response.data.blood_type || '',
          address: response.data.address || '',
        });
        setUserID(response.data._id);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load user data.');
      }
    };

    loadUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(
        `https://seniorproject-1-3rbo.onrender.com/api/user/update-profile`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert('Success', 'Your profile has been updated.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      handleChange('date_of_birth', formatted);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Enter your username"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={form.phone_number}
        onChangeText={(text) => handleChange('phone_number', text)}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Date of Birth</Text>
      <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{form.date_of_birth || 'Select Date of Birth'}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={form.date_of_birth ? new Date(form.date_of_birth) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.gender}
          onValueChange={(value) => handleChange('gender', value)}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      <Text style={styles.label}>Blood Type</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.blood_type}
          onValueChange={(value) => handleChange('blood_type', value)}
        >
          <Picker.Item label="Select Blood Type" value="" />
          <Picker.Item label="A+" value="A+" />
          <Picker.Item label="A-" value="A-" />
          <Picker.Item label="B+" value="B+" />
          <Picker.Item label="B-" value="B-" />
          <Picker.Item label="AB+" value="AB+" />
          <Picker.Item label="AB-" value="AB-" />
          <Picker.Item label="O+" value="O+" />
          <Picker.Item label="O-" value="O-" />
        </Picker>
      </View>

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={form.address}
        onChangeText={(text) => handleChange('address', text)}
        placeholder="Enter your address"
      />

      <Button title="Update" onPress={handleUpdate} color="#D32F2F" />
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
