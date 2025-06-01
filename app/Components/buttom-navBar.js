import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/home';
import ProfileScreen from '../screens/profile';
import RequestBloodScreen from '../screens/requestBlood';
import NotificationsScreen from '../screens/notifications';
import SearchDonorsScreen from '../screens/searchDonors';
import { NotificationContext } from '../contexts/NotificationContext';

const Tab = createBottomTabNavigator();

const CustomPlusButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.plusButtonContainer} onPress={onPress}>
    <View style={styles.plusButton}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function BottomNavbar() {
  const { unreadCount, setUnreadCount, fetchUnreadCount } = useContext(NotificationContext);

  console.log('Unread count in BottomNavbar:', unreadCount);

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

          return (
            <View>
              <Ionicons
                name={iconName}
                size={size}
                color={focused ? '#D32F2F' : 'gray'}
              />
              {route.name === 'Notifications' && unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Notifications"
        component={props => <NotificationsScreen {...props} refreshBadge={fetchUnreadCount} />}
        listeners={{
          tabPress: () => {
            console.log('Notifications tab pressed - resetting unreadCount');
            setUnreadCount(0);
          }
        }}
      />
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
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 10,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    zIndex: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
