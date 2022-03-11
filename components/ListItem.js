/* eslint-disable camelcase */
import React, {useEffect, useState, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Avatar,
  Divider,
  ListItem as RNEListItem,
  Text,
} from 'react-native-elements';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {useUser, useFavourite, useMedia} from '../hooks/ApiHooks';
import AgeIcon from '../assets/age.svg';
import InterestIcon from '../assets/heart.svg';
import LocationIcon from '../assets/location.svg';
import LikeIcon from '../assets/up-arrow.svg';
import {Card} from 'react-native-paper';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {Video} from 'expo-av';
import {MainContext} from '../contexts/MainContext';
import {Button} from 'react-native-paper';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';

const ListItem = ({
  navigation,
  singleMedia,
  myFilesOnly,
  disableDelete = false,
}) => {
  const {setUpdate, update, token, user} = useContext(MainContext);

  const videoRef = useRef(null);

  const [like, setLike] = useState(false);
  const [owner, setOwner] = useState();
  const [additionData, setAdditionData] = useState({fullname: 'fetching...'});

  const {getAllMediaByCurrentUserId, getMediaByUserId, putMedia} = useMedia();
  const {postFavourite, getFavouritesByFileId, getFavourites} = useFavourite();
  const {getUserById} = useUser();

  // fetch user data of file media
  const fetchOwner = async () => {
    try {
      const userData = await getUserById(singleMedia.user_id, token);
      setOwner(userData.username);
      const allData = await JSON.parse(userData.full_name);
      setAdditionData(allData);
    } catch (error) {
      Alert.alert([{text: 'Load owner failed'}]);
      console.error('fetch owner error', error);
      setAdditionData({fullname: '[not available]'});
    }
  };

  // modify title of file since we are not deleting file permanently
  const modifyTitle = async () => {
    const data = {
      title: 'deleted',
      description: singleMedia.description,
    };
    try {
      const response = await putMedia(singleMedia.file_id, token, data);
      if (response) {
        Alert.alert('Delete', 'Deleted successfully', [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(update + 1);
            },
          },
        ]);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteImage = async () => {
    Alert.alert(
      'Are you sure you want to delete this picture?',
      'This picture will be deleted immediately. You cannot undo this action.',
      [
        {
          text: 'Cancel',
          onPress: () => {
            navigation.navigate('Profile');
          },
        },
        {
          text: 'Delete',
          onPress: () => {
            modifyTitle();
          },
        },
      ]
    );
  };

  const checkLike = async () => {
    try {
      // get all favourite of this single user's file
      const allMediaOfSingleUser = await getMediaByUserId(singleMedia.user_id);
      const userFilesId = allMediaOfSingleUser.map(
        (singleMedia) => singleMedia.file_id
      );
      let allLikesofSingleUser = [];
      for (const id of userFilesId) {
        const response = await getFavouritesByFileId(id);
        allLikesofSingleUser = allLikesofSingleUser.concat(response);
      }
      for (let i = 0; i < allLikesofSingleUser.length; i++) {
        if (allLikesofSingleUser[i].user_id === user.user_id) {
          if (like === true) {
            console.log('you liked this user');
            navigation.navigate('Match', {file: singleMedia});
            return;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const likeUser = async () => {
    let alreadyLiked = false;

    let files = await getMediaByUserId(singleMedia.user_id);
    files = files.map((obj) => {
      return obj.file_id;
    });
    const likes = await getFavourites(token);
    likes.forEach((obj) => {
      if (files.includes(obj.file_id)) alreadyLiked = true;
    });

    if (alreadyLiked) {
      Alert.alert('Oops!', `You have already liked ${owner}!`);
      return;
    } else {
      try {
        const response = await postFavourite(singleMedia.file_id, token);
        if (response) {
          const userFiles = await getAllMediaByCurrentUserId(token);
          Alert.alert(`You liked ${owner} !`);

          const userFilesId = userFiles.map((file) => file.file_id);

          // check who likes any photo from current login user
          // and then get their userId
          let allLikesofCurrentUsers = [];
          for (const id of userFilesId) {
            const response = await getFavouritesByFileId(id);
            allLikesofCurrentUsers = allLikesofCurrentUsers.concat(response);
          }
          for (let i = 0; i < allLikesofCurrentUsers.length; i++) {
            if (allLikesofCurrentUsers[i].user_id === singleMedia.user_id) {
              setLike(true);
            }
          }
        }
      } catch (error) {
        Alert.alert('Oops!', `You have already liked ${owner}!`);
        console.error(error);
      }
    }
  };
  const rightActions = () => {
    return (
      <View style={{justifyContent: 'center', width: 100}}>
        <Button
          icon={LikeIcon}
          onPress={() => {
            likeUser();
            closeSwipable();
          }}
        ></Button>
      </View>
    );
  };

  const swipeRef = useRef();
  const closeSwipable = () => {
    setTimeout(() => {
      swipeRef?.current?.close();
    }, 2000);
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  useEffect(() => {
    checkLike();
  }, [like]);

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <ScrollView>
        {myFilesOnly ? (
          <RNEListItem>
            <View style={styles.cardProfile}>
              {singleMedia.media_type === 'image' ? (
                <Avatar
                  containerStyle={styles.avatarProfile}
                  avatarStyle={{borderRadius: 10}}
                  source={{uri: uploadsUrl + singleMedia.thumbnails.w640}}
                  onLongPress={() => {
                    if (!disableDelete) deleteImage();
                  }}
                ></Avatar>
              ) : (
                <Video
                  ref={videoRef}
                  style={styles.avatarProfile}
                  source={{uri: uploadsUrl + singleMedia.filename}}
                  useNativeControls
                  resizeMode="contain"
                ></Video>
              )}
              {singleMedia.description === '' ? (
                <></>
              ) : (
                <Card style={styles.descriptionBox}>
                  <Text style={styles.textDescription}>
                    {singleMedia.description}
                  </Text>
                </Card>
              )}
            </View>
          </RNEListItem>
        ) : (
          <GestureHandlerRootView>
            <Swipeable
              ref={swipeRef}
              onSwipeableOpen={closeSwipable}
              renderRightActions={rightActions}
            >
              <RNEListItem
                onPress={() => {
                  navigation.navigate('Single', {file: singleMedia});
                }}
              >
                <Card style={styles.card}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={styles.name}>{additionData.fullname}</Text>
                  </View>
                  <Avatar
                    containerStyle={styles.avatar}
                    avatarStyle={{
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: '#F2822F',
                    }}
                    source={{uri: uploadsUrl + singleMedia.thumbnails.w640}}
                  ></Avatar>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <AgeIcon height={19} style={styles.icons}></AgeIcon>
                    <Text style={styles.text}>{additionData.age}</Text>
                    <Divider
                      orientation="vertical"
                      style={{
                        marginTop: 12,
                        marginRight: '2%',
                        marginBottom: 5,
                      }}
                    />
                    <LocationIcon style={styles.icons}></LocationIcon>
                    <Text style={styles.text}>{additionData.location}</Text>
                    <Divider
                      orientation="vertical"
                      style={{
                        marginTop: 12,
                        marginRight: '2%',
                        marginBottom: 5,
                      }}
                    />
                    <InterestIcon style={styles.icons}></InterestIcon>
                    <Text style={styles.text}>
                      {typeof additionData.interests !== 'undefined'
                        ? additionData.interests.split(',')[0]
                        : ''}
                    </Text>
                  </View>
                </Card>
              </RNEListItem>
            </Swipeable>
          </GestureHandlerRootView>
        )}
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  name: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  card: {
    height: 400,
    margin: 0,
    padding: 0,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: 'center',
  },
  avatar: {
    width: '95%',
    height: '75%',
    alignSelf: 'center',
  },
  avatarProfile: {
    width: '100%',
    height: 450,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 12,
    marginRight: '5%',
    fontFamily: 'Poppins_400Regular',
  },
  icons: {
    marginTop: 12,
    marginRight: 5,
    marginLeft: 10,
  },
  x: {
    marginTop: 10,
    marginRight: 5,
  },
  textDescription: {
    fontSize: 16,
    color: 'black',
    padding: 20,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular_Italic',
  },
  cardProfile: {
    width: '100%',
    height: '100%',
  },
  descriptionBox: {
    marginTop: 20,
    borderColor: '#FCF2F2',
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
  disableDelete: PropTypes.bool,
};

export default ListItem;
