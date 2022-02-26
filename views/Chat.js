import {View, StyleSheet, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar, ListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useUser,
  useTag,
  userComment,
  useMedia,
  useFavourite,
} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const Chat = ({navigation}) => {
  const {getUserById} = useUser();
  const {getFileByTag} = useTag();
  const {getCommentByFileId} = userComment();
  const {getMediaByUserId, getAllMediaByCurrentUserId} = useMedia();
  const {getFavouritesByFileId} = useFavourite();
  const [username, setUsername] = useState({username: 'fetching...'});
  const [avatar, setAvatar] = useState('http://placekitten.com/180');
  const [message, setMessage] = useState([]);
  const [hook, setHook] = useState([]);

  const fetchNewHooks = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      // get fileIds of all files from current login user
      const userFiles = await getAllMediaByCurrentUserId(token);
      // console.log('All file from current user: ', userFiles);
      const userFilesId = [];
      for (const file of userFiles) {
        userFilesId.push(file.file_id);
      }
      console.log('all fileId from current user: ', userFilesId);

      // check who likes any photo from current login user
      // and then get their userId
      let likeData = [];
      const seen = new Set();
      for (const id of userFilesId) {
        const likeScraping = await getFavouritesByFileId(id);
        likeData = likeData.concat(likeScraping);
      }

      // sort the data in order by favouriteId, most recent -> least recent
      likeData.sort((a, b) => (a.favourite_id > b.favourite_id ? -1 : 1));

      // without filtering
      console.log('like data: ', likeData);

      // with filtering
      likeData = likeData.filter((el) => {
        const duplicate = seen.has(el.user_id);
        seen.add(el.user_id);
        return !duplicate;
      });

      likeData = likeData.slice(0, 5);
      console.log('like data after data cleaning: ', likeData);
      const likedUserId = likeData.map((id) => id.user_id);
      console.log('who like you', likedUserId);

      let newHooksData = [];
      for (const id of likedUserId) {
        let avatarScraping = await getMediaByUserId(id);
        const userScraping = await getUserById(id, token);
        avatarScraping = avatarScraping.filter(
          (obj) => obj.title.toLowerCase() === 'avatar'
        );
        const totalData = {
          ...userScraping,
          ...avatarScraping,
        };
        newHooksData = newHooksData.concat(totalData);
      }
      // console.log('Matched User Data:', matchedUserData);
      // console.log(matchedUserData[1][0].file_id, matchedUserData[1].username);
      setHook(newHooksData);
    } catch (error) {
      console.error('Fetch new hooks error', error);
      setHook({username: 'unknown'});
      setUsername({username: '[not available]'});
    }
  };

  const fetchMessage = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userMessage = await getCommentByFileId(719, token);
      let messageData = [];
      for (const message of userMessage) {
        let avatarScraping = await getMediaByUserId(message.user_id);
        avatarScraping = avatarScraping.filter(
          (obj) => obj.title.toLowerCase() === 'avatar'
        );
        const userScraping = await getUserById(message.user_id, token);
        const totalData = {...message, ...avatarScraping, ...userScraping};
        messageData = messageData.concat(totalData);
      }
      setMessage(messageData);
      // console.log('Message History', messageData);
    } catch (error) {
      console.log('Fetch messages error', error);
    }
  };

  useEffect(() => {
    fetchNewHooks();
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
          <FlatList
            horizontal={true}
            contentContainerStyle={{flexGrow: 1}}
            showsHorizontalScrollIndicator={false}
            style={{marginBottom: '6%'}}
            pagingEnabled={true}
            data={hook}
            keyExtractor={(item) => item.user_id.toString()}
            renderItem={({item}) => (
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
                    source={{uri: uploadsUrl + item[0].filename}}
                  />
                  <Text style={styles.username}>{item.username}</Text>
                </View>
              </ListItem>
            )}
          ></FlatList>
        </View>

        {/* list of messages */}
        <View style={{flex: 1}}>
          <Text style={styles.subTitle}>Messages</Text>
          <FlatList
            pagingEnabled={true}
            contentContainerStyle={{flexGrow: 1}}
            data={message}
            keyExtractor={(item) => item.user_id.toString()}
            renderItem={({item}) => (
              <ListItem style={{flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: '8%',
                    borderBottomWidth: 1,
                    borderBottomColor: '#C4C4C4',
                  }}
                >
                  <Avatar
                    style={styles.avatar}
                    avatarStyle={{
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 60,
                      borderStyle: 'solid',
                    }}
                    source={{uri: uploadsUrl + item[0].filename}}
                  />
                  <View style={{flexDirection: 'column', marginLeft: '6%'}}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.message}>{item.comment}</Text>
                  </View>
                </View>
              </ListItem>
            )}
          ></FlatList>
        </View>

        {/* <View style={{flex: 1}}>
          <Text style={styles.subTitle}>Messages</Text>
          <ScrollView horizontal={false} contentContainerStyle={{flexGrow: 1}}>
            <ListItem style={{flex: 1}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
              >
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
            </ListItem>
          </ScrollView>
        </View> */}
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
