// routes/Routes.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavbar from '../Components/buttom-navBar'; // ⬅️ Import your tab navigator
import Register from '../auth/register';           // ⬅️ Any additional stack screen
import Login from '../auth/login';
import EditBloodRequest from '../screens/editBloodRequest';



const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tab navigator as the main screen */}
      <Stack.Screen name="MainTabs" component={BottomNavbar} />

      {/* Stack screens outside of tab bar */}
      <Stack.Screen name="Register" component={Register} />

      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="editBloodRequest" component={EditBloodRequest}/>
    </Stack.Navigator>
  );
}
