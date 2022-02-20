/* eslint-disable camelcase */
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';
import {Avatar, ListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, useTag, userComment} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import MenuIcon from '../assets/menu.svg';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const Chat = ({navigation}) => {
  const {getUserById} = useUser();
  const {getFileByTag} = useTag();
  const {getCommentByFileId} = userComment();
  const [username, setUsername] = useState({username: 'fetching...'});
  const [avatar, setAvatar] = useState('http://placekitten.com/180');
  const [message, setMessage] = useState({message: 'Not any message'});

  const fetchMatchedUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserById(527, token);
      setUsername(userData);
    } catch (error) {
      console.error('fetch owner error', error);
      setUsername({username: '[not available]'});
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFileByTag('avatar_' + 32);
      if (avatarArray.length === 0) {
        return;
      }
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
      console.log('fetch avatar', avatar);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchMessage = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userMessage = await getCommentByFileId(95, token);
      setMessage(userMessage[userMessage.length - 1]);
      // messages
      for (const m of userMessage) {
        console.log(m.comment);
      }
      // console.log(userMessage[userMessage.length - 1].comment);
    } catch (error) {
      console.error(error.message);
      setMessage({message: 'Chatroom is empty'});
    }
  };

  useEffect(() => {
    fetchMatchedUser();
    fetchAvatar();
    fetchMessage();
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
          {/* title */}
          <View style={{flexDirection: 'row'}}>
            <MenuIcon style={styles.menu}></MenuIcon>
            <Text style={styles.appName}>hook</Text>
          </View>

          {/* showing five recent hooks */}
          <View
            style={{
              marginBottom: '4%',
              borderBottomWidth: 1,
              borderBottomColor: '#C4C4C4',
            }}
          >
            <Text style={styles.subTitle}>New hooks</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              style={{left: 2, marginBottom: '8%'}}
            >
              <ListItem style={{marginLeft: 5}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    style={styles.avatar}
                    avatarStyle={{
                      borderWidth: 1,
                      borderColor: '#E86A74',
                      borderRadius: 10,
                    }}
                    source={{uri: avatar}}
                  />
                  <Text style={styles.username}>{username.username}</Text>
                </View>
              </ListItem>
            </ScrollView>
          </View>

          {/* list of messages */}
          <View>
            <Text style={styles.subTitle}>Messages</Text>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              style={{marginLeft: 2}}
            >
              <ListItem style={{marginLeft: 5}}>
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 60,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.username}>{username.username}</Text>
                  <Text style={styles.message}>{message.comment}</Text>
                </View>
              </ListItem>
            </ScrollView>
          </View>
        </SafeAreaView>
        <StatusBar style="auto"></StatusBar>
      </>
    );
  }
};

const styles = StyleSheet.create({
  subTitle: {
    color: 'black',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    left: 20,
    marginBottom: '3%',
    marginTop: '5%',
    marginLeft: 5,
  },
  menu: {
    marginTop: 15,
    marginBottom: 20,
    marginLeft: 20,
  },
  appName: {
    marginLeft: '20%',
    fontSize: 40,
    fontFamily: 'Poppins_700Bold',
    color: '#EB6833',
    letterSpacing: 5,
  },
  avatar: {
    height: 110,
    width: 110,
  },
  username: {
    fontSize: 20,
    fontFamily: 'Poppins_500Medium',
  },
  message: {
    marginTop: 20,
    fontSize: 20,
    color: '#555151',
    fontFamily: 'Poppins_400Regular',
  },
});

Chat.propTypes = {
  navigation: PropTypes.object,
};

export default Chat;
