import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';




const GOOGLE_API_KEY = 'AIzaSyAVGH1CDRM5yW4kMAAqrhg96fIIzTZIgGU';

export default function RequestBloodScreen() {

  const { id } = useLocalSearchParams();
  const { request } = useLocalSearchParams();
  const requestObj = request ? JSON.parse(request) : null;
  const [patientName, setPatientName] = useState('');
  const [bloodType, setBloodType] = useState('A+');
  const [quantity, setQuantity] = useState('');
  const [donationPoint, setDonationPoint] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [transportation, setTransportation] = useState('not provided');
  const [urgency, setUrgency] = useState('Regular');

  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  useEffect(() => {
  if (requestObj) {
    setPatientName(requestObj.patient_name || '');
    setBloodType(requestObj.blood_type || 'A+');
    setQuantity(String(requestObj.quantity || ''));
    setDonationPoint(requestObj.donation_point || '');
    setSearchQuery(requestObj.donation_point || '');
    setContactNumber(requestObj.contact_number || '');
    setTransportation(requestObj.transportation || 'not provided');
    setUrgency(requestObj.urgency || 'Regular');
    // set map location if coords available
    if (requestObj.donation_point_lat && requestObj.donation_point_lng) {
      setLocation({
        latitude: requestObj.donation_point_lat,
        longitude: requestObj.donation_point_lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }
}, []);


  useEffect(() => {
    if (searchQuery.length < 2) {
      setPlaces([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_API_KEY}&input=${searchQuery}&location=${location?.latitude},${location?.longitude}&radius=5000`;
        const response = await axios.get(url);
        setPlaces(response.data.predictions);
      } catch (error) {
        console.error('Error fetching autocomplete:', error);
      }
    };

    fetchSuggestions();
  }, [searchQuery, location]);

  const handlePlaceSelect = async (placeId, description) => {
    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_API_KEY}&place_id=${placeId}`;
      const response = await axios.get(detailsUrl);
      const coords = response.data.result.geometry.location;

      const newLocation = {
        latitude: coords.lat,
        longitude: coords.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(newLocation);
      setSelectedPlace(response.data.result);
      setPlaces([]);
      setSearchQuery(description);
      setDonationPoint(description);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const resetForm = () => {
    setPatientName('');
    setBloodType('A+');
    setQuantity('');
    setDonationPoint('');
    setSearchQuery('');
    setContactNumber('');
    setTransportation('not provided');
    setUrgency('Regular');
    setSelectedPlace(null);
  };

  const handleSubmit = async () => {
    if (!patientName || !quantity || !donationPoint || !contactNumber) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    if (isNaN(quantity) || !Number.isInteger(Number(quantity))) {
      Alert.alert('Invalid Quantity', 'Quantity must be an integer.');
      return;
    }

    if (!/^\d{8}$/.test(contactNumber)) {
      Alert.alert('Invalid Phone Number', 'Phone number must be 8 digits.');
      return;
    }

    if (!selectedPlace || !selectedPlace.geometry?.location) {
      Alert.alert('Location Missing', 'Please select a donation point from the map.');
      return;
    }

    const geoLocation = {
      type: 'Point',
      coordinates: [
        selectedPlace.geometry.location.lng,
        selectedPlace.geometry.location.lat,
      ],
    };

    const requestData = {
  patient_name: patientName,
  blood_type: bloodType,
  quantity: parseInt(quantity),
  donation_point: donationPoint,
  donation_point_lat: selectedPlace.geometry.location.lat,
  donation_point_lng: selectedPlace.geometry.location.lng,
  contact_number: contactNumber,
  transportation,
  urgency,
  location: {
    type: 'Point',
    coordinates: [
      selectedPlace.geometry.location.lng,
      selectedPlace.geometry.location.lat,
    ],
  },
};


    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Not Authenticated', 'Please log in to make a request.');
        return;
      }
      console.log("data",requestData);
      const response = await axios.put(
        `https://seniorproject-r3mq.onrender.com/api/request/update/${id}`
,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Success:', response.data);
      Alert.alert('Success', 'Request submitted successfully!');
      resetForm();
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Blood Request Form</Text>

        <Text style={styles.label}>Patient Name</Text>
        <TextInput
          style={styles.input}
          value={patientName}
          onChangeText={setPatientName}
          placeholder="Enter patient name"
        />

        <Text style={styles.label}>Blood Type</Text>
        <Picker
          selectedValue={bloodType}
          onValueChange={setBloodType}
          style={styles.picker}
        >
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
            <Picker.Item label={type} value={type} key={type} />
          ))}
        </Picker>

        <Text style={styles.label}>Quantity (units)</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Enter quantity"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Donation Point</Text>
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for nearby places"
        />
        {places.length > 0 && (
          <FlatList
            style={styles.list}
            data={places}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handlePlaceSelect(item.place_id, item.description)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <MapView style={styles.map} region={location}>
          {location && <Marker coordinate={location} title="You are here" />}
          {selectedPlace && (
            <Marker
              coordinate={{
                latitude: selectedPlace.geometry.location.lat,
                longitude: selectedPlace.geometry.location.lng,
              }}
              title={selectedPlace.name}
              description={selectedPlace.formatted_address}
            />
          )}
        </MapView>

        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholder="Enter 8-digit phone number"
          keyboardType="number-pad"
          maxLength={8}
        />

        <Text style={styles.label}>Transportation</Text>
        <Pressable
          style={styles.toggleButton}
          onPress={() =>
            setTransportation((prev) =>
              prev === 'provided' ? 'not provided' : 'provided'
            )
          }
        >
          <Text style={styles.toggleButtonText}>{transportation}</Text>
        </Pressable>

        <Text style={styles.label}>Urgency</Text>
        <Picker
          selectedValue={urgency}
          onValueChange={setUrgency}
          style={styles.picker}
        >
          <Picker.Item label="Regular" value="Regular" />
          <Picker.Item label="Urgent" value="Urgent" />
        </Picker>

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Edit Request</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  picker: {
    backgroundColor: '#fff',
    marginTop: 4,
    borderRadius: 8,
  },
  toggleButton: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  list: {
    backgroundColor: '#fff',
    maxHeight: 150,
    marginBottom: 10,
    zIndex: 1000,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  map: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
