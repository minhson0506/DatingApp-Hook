import {View, StyleSheet, Text, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import {Avatar, ListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, userComment, useMedia, useFavourite} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';

const Chat = ({navigation}) => {
  const {getUserById, getUserByToken} = useUser();
  const {getCommentByFileId, getComments} = userComment();
  const {getMediaByUserId, getAllMediaByCurrentUserId, getMediaByFileId} =
    useMedia();
  const {getFavouritesByFileId} = useFavourite();
  const {getFavourites} = useFavourite();
  const [message, setMessage] = useState(0);
  const [hook, setHook] = useState(0);
  const {loadMessage} = useContext(MainContext);

  const fetchNewHooks = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      // user likes
      // get fileId of all files current users liked
      const userLike = await getFavourites(token);
      // console.log('what files current user liked: ', userLike);

      // get the owner userId of those files
      const userLikeFileId = userLike.map((file) => file.file_id);
      // console.log('the file id current user liked: ', userLikeFileId);
      let hookUserId = [];
      for (const fileId of userLikeFileId) {
        const fileInfo = await getMediaByFileId(fileId);
        hookUserId.push(fileInfo.user_id);
      }
      // remove duplicate userId
      hookUserId = [...new Set(hookUserId)];
      // console.log('who you like', hookUserId);

      // hooks like
      // get fileIds of all files from current login user
      const userFiles = await getAllMediaByCurrentUserId(token);
      // console.log('All file from current user: ', userFiles);
      const userFilesId = userFiles.map((file) => file.file_id);
      // console.log('all fileId from current user: ', userFilesId);

      // check who likes any photo from current login user
      // and then get their userId
      let likeData = [];
      const seen = new Set();
      for (const id of userFilesId) {
        const likeScraping = await getFavouritesByFileId(id);
        likeData = likeData.concat(likeScraping);
      }
      // console.log('like data: ', likeData);

      // sort the data in order by favouriteId, most recent -> least recent
      likeData.sort((a, b) => (a.favourite_id > b.favourite_id ? -1 : 1));

      // without filtering
      // console.log('like data: ', likeData);

      // with filtering
      // remove duplicate like
      likeData = likeData.filter((el) => {
        const duplicate = seen.has(el.user_id);
        seen.add(el.user_id);
        return !duplicate;
      });
      // for (let i = 0; i < likeData.length; ++i) {
      //   if (hookUserId.includes(likeData[i].user_id) === false) {
      //     likeData.splice(i, 1);
      //   }
      // }
      likeData = likeData.filter(
        (obj) => hookUserId.includes(obj.user_id) === true
      );
      // console.log('like data after data cleaning: ', likeData);

      // take five hooks
      likeData = likeData.slice(0, 5);
      // console.log('like data after data cleaning: ', likeData);
      const likedUserId = likeData.map((id) => id.user_id);
      // console.log('who like you', likedUserId);

      let newHooksData = [];
      for (const id of likedUserId) {
        let avatarScraping = await getMediaByUserId(id);
        const userScraping = await getUserById(id, token);
        avatarScraping = avatarScraping.filter(
          (obj) => obj.title.toLowerCase() === 'avatar'
        );
        const totalData = {
          ...userScraping,
          ...avatarScraping.pop(),
        };
        newHooksData = newHooksData.concat(totalData);
      }
      // console.log('Matched User Data:', newHooksData);
      // console.log(matchedUserData[1][0].file_id, matchedUserData[1].username);
      newHooksData != [] ? setHook(newHooksData) : setHook(0);
    } catch (error) {
      console.error('Fetch new hooks error', error);
      // setHook({username: 'unknown'});
      // setUsername({username: '[not available]'});
    }
  };

  const fetchMessage = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userFiles = await getAllMediaByCurrentUserId(token);
      const currentUserId = (await getUserByToken(token)).user_id;
      // console.log('my user Id is', currentUserId);

      // see who comment(chat) on any of your file
      // get all fileId from current login user
      const userFilesId = userFiles.map((file) => file.file_id);
      // console.log('fileIds from current user', userFilesId);
      // get the userId from new hooks who message you
      let hookUserId = [];
      for (const fileId of userFilesId) {
        const file = await getCommentByFileId(fileId);
        for (const fileInfo of file) {
          hookUserId.push(fileInfo.user_id);
        }
      }
      // what if current user is the one who start first?
      // all files current users like
      const userLikeFile = await getComments(token);
      // console.log('what user likes', userLikeFile[0].file_id);
      const userLikeFileId = userLikeFile.map((item) => item.file_id);
      // console.log('fileId', userLikeFileId);
      for (const fileId of userLikeFileId) {
        const owner = await getMediaByFileId(fileId);
        // console.log('hi', owner.user_id);
        hookUserId.push(owner.user_id);
      }

      // Getting userId of both sides
      // console.log('hook id before cleaning', hookUserId);
      hookUserId = [...new Set(hookUserId)];
      // console.log('hook Id: ', hookUserId);

      let messageData = [];
      let singleMessageData = [];

      for (const userId of hookUserId) {
        // first part get hook avatar info and user info by hooks user Id
        // avatar info to get the avatar filename
        let avatarScraping = await getMediaByUserId(userId);
        avatarScraping = avatarScraping.filter(
          (obj) => obj.title.toLowerCase() === 'avatar'
        );
        // console.log('avatar data', avatarScraping);

        // user info to get the username of hooks
        const userInfoScraping = await getUserById(userId, token);
        // console.log('user info', userInfoScraping);

        // get message from hook or current users, depends on who send message first
        let allCm = [];
        for (const id of userFilesId) {
          allCm = allCm.concat(await getCommentByFileId(id));
        }
        allCm = allCm.filter((obj) => obj.user_id === userId);
        // likeData.sort((a, b) => (a.favourite_id > b.favourite_id ? -1 : 1));

        // get all files from the hook users
        const hookFile = await getMediaByUserId(userId);
        // console.log('hook file info', hookFile);
        const hookFileId = hookFile.map((file) => file.file_id);
        // console.log('hook file id', hookFileId);

        let myCm = [];
        for (const id of hookFileId) {
          myCm = myCm.concat(await getCommentByFileId(id));
        }
        myCm = myCm.filter((obj) => obj.user_id === currentUserId);
        myCm.forEach((item) => {
          item.user_id = userId;
        });
        // console.log('current user message to hook', myCm);
        allCm = allCm.concat(myCm);
        // console.log(allCm);

        const totalData = {
          ...avatarScraping.pop(),
          ...userInfoScraping,
          ...allCm.slice(-1).pop(),
        };

        const totalSingleMessageData = {
          ...avatarScraping.pop(),
          ...userInfoScraping,
        };

        // console.log('total data', totalData);
        messageData = messageData.concat(totalData);
        singleMessageData = singleMessageData.concat(totalSingleMessageData);
      }
      messageData.sort((a, b) => (a.comment_id > b.comment_id ? -1 : 1));
      // console.log('message info', messageData);
      messageData != [] ? setMessage(messageData) : setMessage(0);
      // console.log('Message History', messageData);

      singleMessageData = [...new Set(singleMessageData)];
      // setSingleMessage(singleMessageData);
      // console.log('data for navigation:', singleMessageData);
    } catch (error) {
      console.log('Fetch messages error', error);
    }
  };

  useEffect(() => {
    fetchNewHooks();
    fetchMessage();
  }, [loadMessage]);

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
          {hook != 0 ? (
            <FlatList
              horizontal={true}
              contentContainerStyle={{flexGrow: 1}}
              showsHorizontalScrollIndicator={false}
              style={{marginBottom: '6%'}}
              pagingEnabled={true}
              data={hook}
              keyExtractor={(item) => item.user_id.toString()}
              renderItem={({item}) => (
                <ListItem
                  onPress={() => {
                    navigation.navigate('SingleChat', {item});
                  }}
                >
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
                      source={{uri: uploadsUrl + item.filename}}
                    />
                    <Text style={styles.username}>{item.username}</Text>
                  </View>
                </ListItem>
              )}
            ></FlatList>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  styles.username,
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginVertical: '20%',
                    color: '#555151',
                  },
                ]}
              >
                No any hook yet
              </Text>
            </View>
          )}
        </View>

        {/* list of messages */}
        <View style={{flex: 1}}>
          <Text style={styles.subTitle}>Messages</Text>
          {message != 0 ? (
            <FlatList
              pagingEnabled={true}
              contentContainerStyle={{flexGrow: 1}}
              data={message}
              keyExtractor={(item) => item.user_id.toString()}
              renderItem={({item}) => (
                <ListItem
                  style={{flex: 1}}
                  onPress={() => {
                    navigation.navigate('SingleChat', {item});
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
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
                      source={{uri: uploadsUrl + item.filename}}
                    />
                    <View style={{flexDirection: 'column', marginLeft: '6%'}}>
                      <Text style={styles.username}>{item.username}</Text>
                      <Text style={styles.message}>
                        {item.comment.length > 24
                          ? item.comment.slice(0, 25) + '...'
                          : item.comment}
                      </Text>
                    </View>
                  </View>
                </ListItem>
              )}
            ></FlatList>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  styles.username,
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginVertical: '40%',
                    color: '#555151',
                  },
                ]}
              >
                No any message yet
              </Text>
            </View>
          )}
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
