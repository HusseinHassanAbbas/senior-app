import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/home';
import ProfileScreen from '../screens/profile';
import RequestBloodScreen from '../screens/requestBlood';
import NotificationsScreen from '../screens/notifications';
import SearchDonorsScreen from '../screens/searchDonors';

const Tab = createBottomTabNavigator();

// Keep your existing custom plus button
const CustomPlusButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.plusButtonContainer} onPress={onPress}>
    <View style={styles.plusButton}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function BottomNavbar() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 50,
          paddingBottom: 5,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Notifications') iconName = 'notifications';
          else if (route.name === 'SearchDonors') iconName = 'search';

          if (iconName) {
            return (
              <Ionicons
                name={iconName}
                size={size}
                color={focused ? '#D32F2F' : 'gray'}
              />
            );
          }

          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />

      

      {/* ➕ Custom Center Button */}
      <Tab.Screen
        name="RequestBlood"
        component={RequestBloodScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="add" size={30} color="white" />
          ),
          tabBarButton: (props) => <CustomPlusButton {...props} />,
        }}
      />

      {/* 🔍 NEW Search Button */}
      <Tab.Screen name="SearchDonors" component={SearchDonorsScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  plusButtonContainer: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3', // Blue background
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 10,
  },
});
