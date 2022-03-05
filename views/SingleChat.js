import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Input, ListItem} from 'react-native-elements';
import {Button} from 'react-native-paper';
import {PropTypes} from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, useMedia, userComment} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const SingleChat = ({route, navigation}) => {
  const {item} = route.params;
  const [additionData, setAdditionData] = useState({fullname: 'fetching...'});
  const [allMessage, setAllMessage] = useState(0);
  const [newComment, setNewComment] = useState('');
  const {getUserById, getUserByToken} = useUser();
  const {getAllMediaByCurrentUserId, getMediaByUserId} = useMedia();
  const {getCommentByFileId, postComment} = userComment();

  const fetchAllMessage = async () => {
    try {
      const allData = await JSON.parse(item.full_name);
      const token = await AsyncStorage.getItem('userToken');
      let messageHistory = [];
      const hookUserId = item.user_id;
      const currentUserId = (await getUserByToken(token)).user_id;
      // console.log('my hook user id', hookUserId);
      // console.log('my user id:', currentUserId);

      // get messages from hook to current user
      const userFiles = await getAllMediaByCurrentUserId(token);
      // console.log('file from current user', userFiles);
      const userFilesId = userFiles.map((file) => file.file_id);
      // console.log('file id from current user', userFilesId);
      for (const fileId of userFilesId) {
        let messageScraping = await getCommentByFileId(fileId);
        messageScraping = messageScraping.filter(
          (obj) => obj.user_id === hookUserId
        );
        messageHistory = messageHistory.concat(messageScraping);
      }
      // console.log('message so far', messageHistory);

      // get messages from current user to hook
      const hookFile = await getMediaByUserId(hookUserId);
      // console.log('hook files', hookFile);
      const hookFileId = hookFile.map((file) => file.file_id);
      // console.log('hook file id', hookFileId);

      for (const fileId of hookFileId) {
        let messageScraping = await getCommentByFileId(fileId);
        messageScraping = messageScraping.filter(
          (obj) => obj.user_id === currentUserId
        );
        messageHistory = messageHistory.concat(messageScraping);
      }

      messageHistory.sort((a, b) => (a.comment_id > b.comment_id ? 1 : -1));
      setAllMessage(messageHistory);
      // console.log('message history', messageHistory);
      setAdditionData(allData);
    } catch (error) {
      console.log('Fetch all messages error', error);
    }
  };

  const sendMessage = async (cm) => {
    // send message to hook's avatar file
    const hookUserId = item.user_id;
    const hookFile = await getMediaByUserId(hookUserId);
    console.log(hookFile);
  };

  useEffect(() => {
    fetchAllMessage();
  }, []);

  return (
    <>
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        {/* header: avatar, hook username and interest */}
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              marginLeft: '5%',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('Chat');
              }}
            >
              <Image
                style={styles.leftButton}
                source={require('../assets/backButton.png')}
              />
            </TouchableWithoutFeedback>
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
            <View style={{flexDirection: 'column', marginLeft: '3%'}}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.interests}>{additionData.interests}</Text>
            </View>
            <TouchableWithoutFeedback>
              <Image
                style={styles.rightButton}
                source={require('../assets/moreButton.png')}
              />
            </TouchableWithoutFeedback>
          </View>

          {/* message content */}
          <FlatList
            pagingEnabled={true}
            contentContainerStyle={{flexGrow: 1}}
            data={allMessage}
            keyExtractor={(item) => item.comment_id.toString()}
            renderItem={({item}) => (
              <ListItem style={{flex: 1}}>
                <Text>{item.comment}</Text>
              </ListItem>
            )}
          ></FlatList>

          {/* input */}
          <View style={{bottom: 20, flexDirection: 'row'}}>
            <Input
              value={newComment}
              autoCapitalize="none"
              placeholder="Type your message..."
              onChangeText={(value) => setNewComment(value)}
            />
            <Button
              mode="contained"
              onPress={() => console.log('Pressed')}
            ></Button>
          </View>
        </View>
      </SafeAreaView>
      <StatusBar style="auto"></StatusBar>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
  },
  username: {
    fontSize: 18,
    fontWeight: '500',
  },
  interests: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C7878',
  },
  leftButton: {
    height: 25,
    width: 25,
    marginRight: '5%',
  },
  rightButton: {
    height: 30,
    width: 30,
    position: 'absolute',
    right: 20,
  },
});

SingleChat.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SingleChat;
