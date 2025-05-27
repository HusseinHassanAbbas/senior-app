import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showAccountSettings, setShowAccountSettings] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const email = await AsyncStorage.getItem('userEmail');

        if (email && token) {
          const res = await axios.get(`https://seniorproject-1-3rbo.onrender.com/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(res.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowInfo(!showInfo);
  };

  const toggleAccountSettingsDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAccountSettings(!showAccountSettings);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Logged out', 'You have been successfully logged out.');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#D32F2F" />;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>No user data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFF5F5' }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user.name || 'No Name'}</Text>
          <Text style={styles.email}>{user.email || 'No Email'}</Text>
        </View>
        <Image
          source={{ uri: 'https://www.w3schools.com/howto/img_avatar.png' }}
          style={styles.avatar}
        />
      </View>

      {/* My Activities Button */}
      <Pressable
        style={[styles.editButton, { marginHorizontal: 15, marginBottom: 10, backgroundColor: '#1976D2' }]}
        onPress={() => router.push('/screens/activityLog')}
      >
        <Text style={styles.editButtonText}>My Activities</Text>
      </Pressable>

      {/* Personal Info */}
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownHeader}>
        <Text style={styles.dropdownText}>Personal Information</Text>
        <Ionicons name={showInfo ? 'chevron-up' : 'chevron-down'} size={24} color="black" />
      </TouchableOpacity>

      {showInfo && (
        <View style={styles.dropdownContent}>
          <Text style={styles.label}>Username: <Text style={styles.value}>{user.name || 'N/A'}</Text></Text>
          <Text style={styles.label}>Phone: <Text style={styles.value}>{user.phone_number || 'N/A'}</Text></Text>
          <Text style={styles.label}>Date of Birth: <Text style={styles.value}>{user.date_of_birth.slice(0,10) || 'N/A'}</Text></Text>
          <Text style={styles.label}>Gender: <Text style={styles.value}>{user.gender || 'N/A'}</Text></Text>
          <Text style={styles.label}>Blood Type: <Text style={styles.value}>{user.blood_type || 'N/A'}</Text></Text>
          <Text style={styles.label}>Address: <Text style={styles.value}>{user.address || 'N/A'}</Text></Text>

          <Pressable
            style={styles.editButton}
            onPress={() => router.push('/screens/editPersonalInformation')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>
      )}

      {/* Account Settings */}
      <TouchableOpacity onPress={toggleAccountSettingsDropdown} style={styles.dropdownHeader}>
        <Text style={styles.dropdownText}>Account Settings</Text>
        <Ionicons name={showAccountSettings ? 'chevron-up' : 'chevron-down'} size={24} color="black" />
      </TouchableOpacity>

      {showAccountSettings && (
        <View style={styles.dropdownContent}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ccc', true: '#D32F2F' }}
              thumbColor={notificationsEnabled ? '#fff' : '#888'}
            />
          </View>

          <Pressable
            style={[styles.editButton, { marginTop: 20 }]}
            onPress={() => router.push('/screens/changePassword')}
          >
            <Text style={styles.editButtonText}>Change Password</Text>
          </Pressable>

          <Pressable
            style={[styles.editButton, { backgroundColor: '#888', marginTop: 10 }]}
            onPress={handleLogout}
          >
            <Text style={styles.editButtonText}>Logout</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF5F5',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  email: {
    fontSize: 16,
    color: '#333',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 15,
    backgroundColor: '#ccc',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownContent: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444',
  },
  value: {
    fontWeight: 'normal',
    color: '#000',
  },
  editButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});
