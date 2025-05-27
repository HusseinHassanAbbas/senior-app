// App.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

import TopNavbar from './Components/top-navBar';
import Routes from './routes/Routes'; // Your combined Stack + Tabs

export default function App() {
  return (
      <View style={styles.container}>
        <TopNavbar />
        <View style={styles.navigatorContainer}>
          <Routes />
        </View>
      </View>
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
