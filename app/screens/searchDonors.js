import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchDonors = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch('https://seniorproject-1-3rbo.onrender.com/api/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log('Fetched Donors:', data);

    // set the users array, not the whole data object
    setDonors(data.users);
    setFilteredDonors(data.users);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching donors:', error);
    setLoading(false);
  }
};


  // Autocomplete for location input
  useEffect(() => {
    if (locationInput.trim() === '') {
      setSuggestions([]);
      setSelectedLocation(null);
      return;
    }

    const matches = [...new Set(donors.map(d => d.address).filter(Boolean))]
      .filter(addr => addr.toLowerCase().includes(locationInput.toLowerCase()));

    setSuggestions(matches);
  }, [locationInput, donors]);

  // Filter when user clicks the button
  const handleFilter = () => {
    let filtered = donors;

    if (name) {
      filtered = filtered.filter(d =>
        d.name?.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (selectedBloodType) {
      filtered = filtered.filter(d => d.blood_type === selectedBloodType);
    }

    if (selectedLocation) {
      filtered = filtered.filter(d => d.address === selectedLocation);
    }

    setFilteredDonors(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>Blood Type: {item.blood_type}</Text>
      <Text>Phone: {item.phone}</Text>
      {item.address && (
        <Text
          style={styles.linkText}
          onPress={() => {
            const url = Platform.select({
              ios: `http://maps.apple.com/?q=${encodeURIComponent(item.address)}`,
              android: `geo:0,0?q=${encodeURIComponent(item.address)}`,
            });
            Linking.openURL(url);
          }}>
          Location: {item.address}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#D32F2F" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Search Donors</Text>

      <TextInput
        placeholder="Search by name"
        value={name}
        onChangeText={setName}
        style={styles.textInput}
      />

      <Picker
        selectedValue={selectedBloodType}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedBloodType(itemValue)}>
        <Picker.Item label="All Blood Types" value="" />
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      <TextInput
        placeholder="Search by location"
        value={locationInput}
        onChangeText={setLocationInput}
        style={styles.textInput}
      />

      {suggestions.length > 0 && (
        <ScrollView style={styles.suggestionBox}>
          {suggestions.map((sugg, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setLocationInput(sugg);
                setSelectedLocation(sugg);
                setSuggestions([]);
              }}>
              <Text style={styles.suggestionItem}>{sugg}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
        <Text style={styles.filterButtonText}>Apply Filters</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredDonors}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </ScrollView>
  );
};

export default SearchDonors;

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
  textInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
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
  linkText: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
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
  filterButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
