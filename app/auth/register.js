import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import axios from 'axios';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [address, setAddress] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState(new Date());
  const [location, setLocation] = useState(null);

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showDonationPicker, setShowDonationPicker] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const coords = {
        longitude: loc.coords.longitude,
        latitude: loc.coords.latitude,
      };

      setLocation({
        type: 'Point',
        coordinates: [coords.longitude, coords.latitude],
      });

      // Reverse geocode to get city/village name
      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        const cityOrVillage = place.city || place.region || place.name || '';
        setAddress(cityOrVillage);
      }
    })();
  }, []);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setDob(new Date());
    setGender('');
    setBloodType('');
    setAddress('');
    setLastDonationDate(new Date());
    setLocation(null);
  };

  const handleRegister = async () => {
    if (!location) {
      Alert.alert('Location Error', 'Location not determined yet.');
      return;
    }

    try {
      const response = await axios.post(
        'https://seniorproject-1-3rbo.onrender.com/api/register',
        {
          name: fullName,
          email: email,
          password: password,
          phone_number: phone,
          date_of_birth: dob,
          gender: gender,
          blood_type: bloodType,
          address: address,
          last_donation_date: lastDonationDate,
          location: location,
        }
      );

      console.log('Success:', response.data);
      Alert.alert('Success', 'User registered successfully');
      resetForm();
    } catch (error) {
      console.error('Error posting data:', error.response?.data || error.message);
      Alert.alert('Registration Error', error.response?.data?.message || 'Server error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Register</Text>

          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
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

          <TextInput
            placeholder="Phone Number"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Date of Birth</Text>
          <Button
            title={dob.toDateString()}
            onPress={() => setShowDobPicker(true)}
            color="#D32F2F"
          />
          {showDobPicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDobPicker(false);
                if (selectedDate) setDob(selectedDate);
              }}
            />
          )}

          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={setGender}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>

          <Text style={styles.label}>Blood Type</Text>
          <Picker
            selectedValue={bloodType}
            style={styles.picker}
            onValueChange={setBloodType}
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

          <TextInput
            placeholder="Address"
            style={[styles.input, { backgroundColor: '#eee' }]}
            value={address}
            editable={false}
          />

          <Text style={styles.label}>Last Donation Date</Text>
          <Button
            title={lastDonationDate.toDateString()}
            onPress={() => setShowDonationPicker(true)}
            color="#D32F2F"
          />
          {showDonationPicker && (
            <DateTimePicker
              value={lastDonationDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDonationPicker(false);
                if (selectedDate) setLastDonationDate(selectedDate);
              }}
            />
          )}

          <Button title="Register" onPress={handleRegister} color="#D32F2F" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF5F5',
    flexGrow: 1,
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
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});
