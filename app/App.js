// App.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

import TopNavbar from './Components/top-navBar';
import Routes from './routes/Routes';
import { NotificationProvider } from './contexts/NotificationContext'; // Adjust the path as needed

export default function App() {
  return (
    <NotificationProvider>
      <View style={styles.container}>
        <TopNavbar />
        <View style={styles.navigatorContainer}>
          <Routes />
        </View>
      </View>
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigatorContainer: {
    flex: 1,
  },
});
