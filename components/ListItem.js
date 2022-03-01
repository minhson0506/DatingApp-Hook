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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import AgeIcon from '../assets/age.svg';
import InterestIcon from '../assets/heart.svg';
import LocationIcon from '../assets/location.svg';
import DislikeIcon from '../assets/dislike.svg';
import {Card} from 'react-native-paper';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {Video} from 'expo-av';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const ListItem = ({navigation, singleMedia, myFilesOnly}) => {
  const {getUserById} = useUser();
  const videoRef = useRef(null);
  // const [owner, setOwner] = useState({username: 'fetching...'});
  const [additionData, setAdditionData] = useState({fullname: 'fetching...'});
  const {putMedia} = useMedia();
  const {setUpdate, update} = useContext(MainContext);

  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // console.log('singlemedia', singleMedia);
      // console.log('user_id', singleMedia.description);
      const userData = await getUserById(singleMedia.user_id, token);
      // console.log('user data', userData);
      // setOwner(userData);
      const allData = await JSON.parse(userData.full_name);
      // console.log('addition data in listitem.js', allData);
      setAdditionData(allData);
    } catch (error) {
      Alert.alert([{text: 'Load owner failed'}]);
      console.error('fetch owner error', error);
      // setOwner({username: '[not available]'});
      setAdditionData({fullname: '[not available]'});
    }
  };

  const modifyTitle = async () => {
    const data = {
      title: 'deleted',
      description: singleMedia.description,
    };
    // console.log('data', data);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await putMedia(singleMedia.file_id, userToken, data);
      // console.log('response for delete', response);
      if (response) {
        Alert.alert('Delete', 'Deleted successfully', [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Profile');
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

  // console.log('type of', typeof additionData.interests);
  // console.log('type of', additionData.interests[0]);
  useEffect(() => {
    fetchOwner();
  }, []);

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
        <RNEListItem
          onPress={() => {
            {
              !myFilesOnly &&
                navigation.navigate('Single', {file: singleMedia});
            }
          }}
        >
          {!myFilesOnly && (
            <Card style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.name}>{additionData.fullname}</Text>
                <DislikeIcon style={styles.x}></DislikeIcon>
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
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <AgeIcon height={19} style={styles.icons}></AgeIcon>
                <Text style={styles.text}>{additionData.age}</Text>
                <Divider
                  orientation="vertical"
                  style={{marginTop: 12, marginRight: '2%', marginBottom: 5}}
                />
                <LocationIcon style={styles.icons}></LocationIcon>
                <Text style={styles.text}>{additionData.location}</Text>
                <Divider
                  orientation="vertical"
                  style={{marginTop: 12, marginRight: '2%', marginBottom: 5}}
                />
                <InterestIcon style={styles.icons}></InterestIcon>
                <Text style={styles.text}>
                  {typeof additionData.interests !== 'undefined'
                    ? additionData.interests.split(',')[0]
                    : ''}
                </Text>
              </View>
            </Card>
          )}
          {myFilesOnly && (
            <View style={styles.cardProfile}>
              {singleMedia.media_type === 'image' ? (
                <Avatar
                  containerStyle={styles.avatarProfile}
                  avatarStyle={{borderRadius: 10}}
                  source={{uri: uploadsUrl + singleMedia.thumbnails.w640}}
                  onLongPress={deleteImage}
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
          )}
        </RNEListItem>
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
    width: '100%',
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
};

export default ListItem;
