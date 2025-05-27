import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TopNavbar() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [storedEmail, setStoredEmail] = useState('')

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
          const storedEmail = await AsyncStorage.getItem('userEmail');
          if (storedEmail) setStoredEmail(storedEmail);
        setToken(storedToken);
      } catch (e) {
        console.error('Failed to load the token', e);
        console.error('Failed to load the email', e);
      }
    };

    checkToken();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setToken(null);
      setMenuVisible(false);
      router.push('/App'); // Go to main page
    } catch (e) {
      console.error('Failed to log out', e);
    }
  };

  return (
    <View style={styles.navbar}>
      <Pressable onPress={() => router.push('/App')}>
      <Text style={styles.appName}>BloodLink</Text>
      </Pressable>
      <View style={styles.buttons}>
        {token ? (
          <View>
            <Pressable style={styles.redButton} onPress={() => setMenuVisible(prev => !prev)}>
              <Text style={styles.buttonText}>{storedEmail} ▾</Text>
            </Pressable>

            {menuVisible && (
              <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                <View style={styles.dropdownWrapper}>
                  <View style={styles.dropdown}>
                    <Pressable onPress={handleLogout}>
                      <Text style={styles.dropdownItem}>Sign Out</Text>
                    </Pressable>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        ) : (
          <>
            <Pressable style={styles.redButton} onPress={() => router.push('/auth/register')}>
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>
            <Pressable style={styles.redButton} onPress={() => router.push('/auth/login')}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dropdownWrapper: {
    position: 'absolute',
    right: 0,
    top: 40,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  redButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
