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
import SingleChat from '../views/SingleChat';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          justifyContent: 'center',
          height: 90,
          border: 0,
          margin: 0,
          padding: 0,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Like':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            // case 'Search':
            //   iconName = focused ? 'search' : 'search-outline';
            //   break;
            case 'Chat':
              iconName = focused
                ? 'chatbox-ellipses'
                : 'chatbox-ellipses-outline';
              break;
          }

          if (route.name === 'Home') {
            return focused ? (
              <Image
                source={require('../assets/hookiconActive.png')}
                style={{height: 32, width: 32}}
              />
            ) : (
              <Image
                source={require('../assets/hookiconNotActive.png')}
                style={{height: 32, width: 32}}
              />
            );
          }

          if (route.name === 'Search') {
            iconName = focused ? 'account-search' : 'account-search-outline';
            return (
              <MaterialCommunityIcons name={iconName} size={42} color={color} />
            );
          }

          return <Ionicons name={iconName} size={42} color={color} />;
        },
        tabBarActiveTintColor: '#EB6833',
        tabBarInactiveTintColor: '#2F2F2F',
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
          <Stack.Screen name="SingleChat" component={SingleChat}></Stack.Screen>
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
