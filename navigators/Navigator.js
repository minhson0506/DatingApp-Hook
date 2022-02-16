import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon, Image} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModifyUser from '../views/ModifyUser';
// import Upload from '../views/Upload';
import Chat from '../views/Chat';
import Like from '../views/Like';
import Search from '../views/Search';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          justifyContent: 'center',
          height: 80,
          border: 0,
          margin: 0,
          padding: 0,
        },
        tabBarIcon: ({focused}) => {
          if (route.name === 'Home') {
            return focused ? (
              <Image
                source={require('../assets/hookiconActive.png')}
                style={{height: 30, width: 30}}
              />
            ) : (
              <Image
                source={require('../assets/hookiconNotActive.png')}
                style={{height: 30, width: 30}}
              />
            );
          }

          if (route.name === 'Like') {
            return focused ? (
              <Image
                source={require('../assets/heartActive.png')}
                style={{height: 30, width: 30}}
              />
            ) : (
              <Image
                source={require('../assets/heartNotActive.png')}
                style={{height: 30, width: 30}}
              />
            );
          }

          if (route.name === 'Search') {
            return focused ? (
              <Image
                source={require('../assets/searchActive.png')}
                style={{height: 30, width: 30}}
              />
            ) : (
              <Image
                source={require('../assets/searchNotActive.png')}
                style={{height: 30, width: 30}}
              />
            );
          }

          if (route.name === 'Chat') {
            return focused ? (
              <Image
                source={require('../assets/chatActive.png')}
                style={{height: 30, width: 30}}
              />
            ) : (
              <Image
                source={require('../assets/chatNotActive.png')}
                style={{height: 30, width: 30}}
              />
            );
          }

          if (route.name === 'Profile') {
            return focused ? (
              <Image
                source={require('../assets/userActive.png')}
                style={{height: 30, width: 30}}
              />
            ) : (
              <Image
                source={require('../assets/userNotActive.png')}
                style={{height: 30, width: 30}}
              />
            );
          }
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={Home}></Tab.Screen>
      <Tab.Screen name="Like" component={Like}></Tab.Screen>
      <Tab.Screen name="Search" component={Search}></Tab.Screen>
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false}}
      ></Tab.Screen>
      <Tab.Screen name="Profile" component={Profile}></Tab.Screen>
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Main"
            component={TabScreen}
            options={{headerShown: false}}
          ></Stack.Screen>
          <Stack.Screen name="Single" component={Single}></Stack.Screen>
          <Stack.Screen
            name="Modify user"
            component={ModifyUser}
          ></Stack.Screen>
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        ></Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen></StackScreen>
    </NavigationContainer>
  );
};

export default Navigator;
