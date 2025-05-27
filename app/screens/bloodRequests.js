import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, ScrollView, Pressable, Platform, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const openInMaps = (location) => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${encodeURIComponent(location)}`,
      android: `geo:0,0?q=${encodeURIComponent(location)}`,
    });
    Linking.openURL(url);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
  try {
    const response = await fetch('https://seniorproject-1-3rbo.onrender.com/api/request');
    const data = await response.json();
    console.log('Fetched Requests:', data.requests);

    // Filter out completed requests
    const incompleteRequests = data.requests.filter((request) => request.done_status !== 'complete');

    setRequests(incompleteRequests);
    setFilteredRequests(incompleteRequests);
  } catch (error) {
    console.error('Error fetching requests:', error);
  } finally {
    setLoading(false);
  }
};

  // Autocomplete suggestions
  useEffect(() => {
    if (addressInput.trim() === '') {
      setSelectedAddress('');
      setSuggestions([]);
      return;
    }
    

    const matches = [...new Set(requests.map(req => req.donation_point))]
      .filter(addr => addr.toLowerCase().includes(addressInput.toLowerCase()));

    setSuggestions(matches);
    setSelectedAddress(addressInput);
  }, [addressInput, requests]);

  // Filter requests
  useEffect(() => {
    let filtered = requests;

    if (selectedBloodType) {
      filtered = filtered.filter(req => req.blood_type === selectedBloodType);
    }

    if (selectedAddress) {
      filtered = filtered.filter(req =>
        req.donation_point.toLowerCase().includes(selectedAddress.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [selectedBloodType, selectedAddress, requests]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.patient_name}</Text>
      <Text>Blood Type: {item.blood_type}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Urgency: {item.urgency}</Text>
      <Pressable onPress={() => openInMaps(item.donation_point)}>
  <Text style={{ color: '#1e90ff', textDecorationLine: 'underline' }}>
    Donation Point: {item.donation_point}
  </Text>
</Pressable>
      <Text>Contact: {item.contact_number}</Text>
      <Text>Created At: {item.updatedAt.slice(0,10)}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#D32F2F" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blood Requests</Text>

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Filter by:</Text>

      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedBloodType}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedBloodType(itemValue)}
        >
          <Picker.Item label="All Blood Types" value="" />
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>

        <TextInput
          placeholder="Search by location"
          value={addressInput}
          onChangeText={setAddressInput}
          style={styles.textInput}
        />

        {suggestions.length > 0 && (
          <ScrollView style={styles.suggestionBox}>
            {suggestions.map((sugg, index) => (
              <TouchableOpacity key={index} onPress={() => {
                setAddressInput(sugg);
                setSelectedAddress(sugg);
                setSuggestions([]);
              }}>
                <Text style={styles.suggestionItem}>{sugg}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default BloodRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#D32F2F',
  },
  filterContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  textInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  suggestionBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 120,
    marginBottom: 8,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  card: {
    backgroundColor: '#fafafa',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
});
