import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native';

export default function DonateBlood({ navigation }) {
  const [showMessage, setShowMessage] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Automatically hide the message after 7 seconds
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  const handleContinue = () => {
    setShowMessage(false);
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    // You can handle the search logic here or navigate to results page
    alert(`Searching for: ${searchQuery}`);
  };

  if (showMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Thank You for Your Kindness!</Text>
        <Text style={styles.message}>
          Your intention to donate blood is a powerful act of generosity and support.
          Together, we can save lives and make our community stronger.
        </Text>
        <Text style={styles.message}>
          We appreciate your willingness to help those in need.
          Stay safe and healthy!
        </Text>

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue →</Text>
        </Pressable>
      </View>
    );
  }

  // Show the search bar after message disappears
  return (
    <View style={styles.container}>
      <Text style={styles.searchTitle}>Search for Nearby Donation Centers</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter city, hospital or center name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <Pressable style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 26,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButton: {
    marginTop: 15,
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
