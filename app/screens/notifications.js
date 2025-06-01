import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import { NotificationContext } from '../contexts/NotificationContext';
import CustomNotificationPopup from './CustomNotificationPopup';
import { useFocusEffect } from '@react-navigation/native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function NotificationsScreen() {
  const { unreadCount, setUnreadCount, fetchUnreadCount } = useContext(NotificationContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    console.log('[DEBUG] Initial fetch and mark read');
    fetchNotifications();
    // markNotificationsAsRead();
    fetchUnreadCount();

    const interval = setInterval(() => {
      console.log('[DEBUG] Polling notifications and unread count...');
      fetchNotifications();
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
  React.useCallback(() => {
    console.log('[DEBUG] Screen focused, marking notifications as read');
    markNotificationsAsRead();
  }, [])
);


  useEffect(() => {
    registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('[DEBUG] Notification received:', notification);

      fetchNotifications();
      fetchUnreadCount();

      const title = notification.request?.content?.title || 'Notification';
      const body = notification.request?.content?.body || '';
      console.log('[DEBUG] Showing popup with:', title, body);
      setPopupData({ title, body });
      setPopupVisible(true);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('[DEBUG] Notification response received:', response);
      setPopupVisible(false);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const response = await fetch('https://seniorproject-r3mq.onrender.com/api/notifications', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('[DEBUG] Fetched notifications:', data.notifications);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      await fetch('https://seniorproject-r3mq.onrender.com/api/mark-read', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[DEBUG] Marked notifications as read');
      setUnreadCount(0);
      fetchNotifications();
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.title}>
        {typeof item.title === 'string' ? item.title : JSON.stringify(item.title)}
      </Text>
      <Text>{typeof item.body === 'string' ? item.body : JSON.stringify(item.body)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />

      <CustomNotificationPopup
        visible={popupVisible}
        data={popupData}
        onClose={() => {
          console.log('[DEBUG] Popup closed');
          setPopupVisible(false);
        }}
      />
    </>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 40 },
  notificationItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'red',
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
