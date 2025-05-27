import React, {  useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';


export default function ActivityLog() {
  const router = useRouter();  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null); // track selected card id
//   const navigation = useNavigation();

  const fetchUserRequests = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      const res = await axios.get(
        'https://seniorproject-r3mq.onrender.com/api/request/my-activity',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('API Response: ', res.data);

      setRequests(res.data.requests);
    } catch (err) {
      console.error('Failed to load requests:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const onEdit = (item) => {
    router.push({
  pathname: '/screens/editBloodRequest',
  params: { request: JSON.stringify(item), id: item._id },
});
  };

  const onDelete = (item) => {
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this request?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');

            const res = await axios.delete(
              `https://seniorproject-r3mq.onrender.com/api/request/${item._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log('Delete response:', res.data);

            // Refresh the list
            fetchUserRequests();
          } catch (err) {
            console.error('Delete failed:', err.response?.data || err.message);
            Alert.alert('Error', 'Failed to delete the request.');
          }
        },
      },
    ]
  );
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Blood Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isSelected = selectedId === item._id;

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                setSelectedId(isSelected ? null : item._id)
              }
            >
              <Text style={styles.item}>
                <Text style={styles.label}>Patient:</Text> {item.patient_name}
              </Text>
              <Text style={styles.item}>
                <Text style={styles.label}>Blood Type:</Text> {item.blood_type}
              </Text>
              <Text style={styles.item}>
                <Text style={styles.label}>Quantity:</Text> {item.quantity}
              </Text>
              <Text style={styles.item}>
                <Text style={styles.label}>Donation Point:</Text> {item.location_name}
              </Text>
              <Text style={styles.item}>
                <Text style={styles.label}>Contact Number:</Text> {item.contact_number}
              </Text>
              <Text style={styles.item}>
                <Text style={styles.label}>Transportation:</Text> {item.transportation}
              </Text>
              <Text style={styles.item}>
                <Text style={styles.label}>Urgency:</Text> {item.urgency}
              </Text>

              {/* Show Edit/Delete buttons if selected */}
              {isSelected && (
                <View style={styles.buttonsContainer}>
                  <Button title="Edit" color="#1976D2" onPress={() => onEdit(item)} />
                  <View style={{ width: 10, marginTop: 10 }} />
                  <Button title="Delete" color="#D32F2F" onPress={() => onDelete(item)} />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No blood requests found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'column',
    marginTop: 10,
    justifyContent: 'flex-start',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 50,
  },
});
