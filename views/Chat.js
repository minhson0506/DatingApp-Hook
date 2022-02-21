import {View, StyleSheet, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar, ListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, useTag, userComment} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

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

  return (
    <>
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        {/* title */}
        <View>
          <Icon style={styles.menu} name="menu" color="#EB6833" size={40} />
          <Text style={styles.title}>hook</Text>
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
            style={{marginBottom: '8%'}}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
          >
            <ListItem>
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
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
            </ListItem>
            <ListItem>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
            </ListItem>
            <ListItem>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
            </ListItem>
            <ListItem>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
            </ListItem>
            <ListItem>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
            </ListItem>
            <ListItem>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
            </ListItem>
            <ListItem>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
            </ListItem>
            <ListItem>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
            </ListItem>
            <ListItem>
              <View
                style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 20,
                    borderStyle: 'solid',
                  }}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{username.username}</Text>
              </View>
            </ListItem>
          </ScrollView>
        </View>

        {/* list of messages */}
        <View style={{flex: 1}}>
          <Text style={styles.subTitle}>Messages</Text>
          <ScrollView horizontal={false} contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
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
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
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
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
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
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
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
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
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
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
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
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <StatusBar style="auto"></StatusBar>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#EB6833',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 3.6,
    marginBottom: '6%',
  },
  subTitle: {
    color: '#EB6432',
    fontSize: 28,
    fontWeight: 'bold',
    left: 20,
    marginBottom: '3%',
  },
  menu: {
    position: 'absolute',
    top: '5%',
    left: 20,
  },
  avatar: {
    height: 110,
    width: 110,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
  },
  message: {
    marginTop: 20,
    fontSize: 20,
    color: '#555151',
    fontWeight: 'normal',
  },
});

Chat.propTypes = {
  navigation: PropTypes.object,
};

export default Chat;
