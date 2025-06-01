import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationListener = useRef();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Listener for incoming push notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      console.log('Push notification received!');
      fetchNotifications();
      fetchUnreadCount();
    });

    // Poll unread count every 5 seconds
    const interval = setInterval(() => {
      console.log('Polling unread count...');
      fetchUnreadCount();
    }, 5000);

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      clearInterval(interval);
    };
  }, []);

  // Debug log when unreadCount changes
  useEffect(() => {
    console.log('Updated unreadCount in context:', unreadCount);
  }, [unreadCount]);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch('https://seniorproject-r3mq.onrender.com/api/notifications', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      await fetch('https://seniorproject-r3mq.onrender.com/api/mark-read', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const fetchUnreadCount = async () => {
  try {
    console.log('[DEBUG] Fetching unread count...');
    
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.warn('[DEBUG] No token found in AsyncStorage.');
      return;
    }

    const response = await fetch('https://seniorproject-r3mq.onrender.com/api/unread-count', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DEBUG] Response not OK:', response.status, errorText);
      return;
    }

    const data = await response.json();
    console.log('[DEBUG] Fetched unread count response:', data);

    const count = data.unreadCount;  // <-- fixed to correct key
    if (count !== undefined) {
      console.log('[DEBUG] Unread count received:', count);
      setUnreadCount(count);
    } else {
      console.warn('[DEBUG] Count not found in response:', data);
      setUnreadCount(0);
    }
  } catch (error) {
    console.error('[DEBUG] Error getting unread count:', error);
  }
};



  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAllAsRead,
        fetchUnreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
