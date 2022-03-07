/* eslint-disable camelcase */
import {View, StyleSheet, Text, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {Avatar, ListItem, Divider} from 'react-native-elements';
import {useUser, userComment, useMedia, useFavourite} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {Menu, MenuItem} from 'react-native-material-menu';
import MenuIcon from '../assets/menu.svg';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import HookIcon from '../assets/like.svg';
import HeartIcon from '../assets/heart.svg';

const Chat = ({navigation}) => {
  const {getUserById, getUserByToken} = useUser();
  const {getCommentByFileId, getComments} = userComment();
  const {getMediaByUserId, getAllMediaByCurrentUserId, getMediaByFileId} =
    useMedia();
  const {getFavouritesByFileId} = useFavourite();
  const {getFavourites} = useFavourite();
  const [message, setMessage] = useState(0);
  const [hook, setHook] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [didMount, setDidMount] = useState(false);
  const {loadMessage, token} = useContext(MainContext);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  // menu state & functions
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const fetchNewHooks = async () => {
    try {
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
        // console.log('ava', avatarScraping.pop().file_id);
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

      // console.log('who message you', hookUserId);

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

      // filter user not belong our app
      hookUserId = await Promise.all(
        hookUserId.map(async (obj) => {
          return await getUserById(obj, token);
        })
      );

      hookUserId = hookUserId.filter((obj) => {
        let filter = false;
        if (isJson(obj.full_name)) {
          const additionData = JSON.parse(obj.full_name);
          // eslint-disable-next-line no-prototype-builtins
          if (additionData.hasOwnProperty('deleted_hook')) filter = true;
        }
        return filter;
      });

      hookUserId = hookUserId.map((obj) => {
        return obj.user_id;
      });

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
        allCm.sort((a, b) => (a.comment_id > b.comment_id ? 1 : -1));

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
      // console.log('hook', hookUserId);
      messageData.sort((a, b) => (a.comment_id > b.comment_id ? -1 : 1));
      messageData = messageData.filter((obj) => {
        return hookUserId.includes(obj.user_id);
      });
      // console.log('message info', messageData);
      messageData != [] ? setMessage(messageData) : setMessage(null);
      // console.log('Message History', messageData);

      singleMessageData = [...new Set(singleMessageData)];
      singleMessageData = singleMessageData.filter((obj) => {
        return hookUserId.includes(obj.user_id);
      });
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds === 100) {
        setSeconds(0);
      } else {
        setSeconds(seconds + 1);
      }
      fetchMessage();
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, []);

  if (!didMount) {
    return null;
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: '8%',
          }}
        >
          <Menu
            style={styles.menuBox}
            visible={visible}
            anchor={
              <MenuIcon
                style={styles.menu}
                onPress={() => {
                  showMenu();
                }}
              ></MenuIcon>
            }
            onRequestClose={hideMenu}
          >
            <MenuItem
              pressColor={'#FDC592'}
              textStyle={styles.textMenu}
              onPress={() => {
                hideMenu();
                navigation.navigate('Modify user');
              }}
            >
              Account
            </MenuItem>
            <MenuItem
              pressColor={'#FDC592'}
              textStyle={styles.textMenu}
              onPress={() => {
                hideMenu();
                navigation.navigate('Instructions');
              }}
            >
              How Hook works
            </MenuItem>
          </Menu>
          <Text style={styles.appName}>hook</Text>
          <Text style={{color: 'white'}}>Text</Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.subTitle}>New Hooks</Text>
          <HookIcon
            height={15}
            style={{marginTop: 10, marginLeft: 5}}
          ></HookIcon>
        </View>
        {hook != 0 ? (
          <View>
            <FlatList
              contentContainerStyle={{marginLeft: 10}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={hook}
              keyExtractor={(item) => item.user_id.toString()}
              renderItem={({item}) => (
                <ListItem
                  containerStyle={{
                    justifyContent: 'space-evenly',
                    padding: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('SingleChat', {item});
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      style={styles.avatar}
                      avatarStyle={{
                        borderWidth: 1,
                        borderColor: '#EB6833',
                        borderRadius: 10,
                      }}
                      source={{uri: uploadsUrl + item.filename}}
                    />
                    <Text style={styles.username}>{item.username}</Text>
                  </View>
                </ListItem>
              )}
            ></FlatList>
            <Divider style={{marginBottom: 10, marginTop: 5}}></Divider>
          </View>
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
              No hook yet!
            </Text>
          </View>
        )}

        <>
          {/* list of messages */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.subTitle}>Messages</Text>
            <HeartIcon
              height={15}
              style={{marginTop: 10, marginLeft: 5}}
            ></HeartIcon>
          </View>

          {message != 0 ? (
            <FlatList
              data={message}
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
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      style={{height: 90, width: 90}}
                      avatarStyle={{
                        borderRadius: 50,
                        borderColor: '#EB6833',
                        borderWidth: 1,
                      }}
                      source={{uri: uploadsUrl + item.filename}}
                    />
                    <View style={{flexDirection: 'column', marginLeft: '5%'}}>
                      <Text style={styles.username}>{item.username}</Text>
                      <Text style={styles.message}>
                        {item.comment.length > 24
                          ? item.comment.slice(0, 25) + '...'
                          : item.comment}
                      </Text>
                    </View>
                  </View>
                  <Divider style={{marginBottom: 5, marginTop: 5}}></Divider>
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
                No message yet!
              </Text>
            </View>
          )}
        </>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  menu: {
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  menuBox: {
    marginTop: 45,
    marginLeft: 10,
    borderRadius: 5,
  },
  textMenu: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  appName: {
    fontSize: 40,
    fontFamily: 'Poppins_700Bold',
    color: '#EB6833',
    letterSpacing: 5,
  },
  subTitle: {
    color: '#434242',
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  avatar: {
    height: 110,
    width: 100,
  },
  username: {
    color: '#EB6432',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  message: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    color: '#555151',
  },
});

Chat.propTypes = {
  navigation: PropTypes.object,
};

export default Chat;
