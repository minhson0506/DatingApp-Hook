import React, {useEffect, useState, useContext} from 'react';
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
import {MainContext} from '../contexts/MainContext';

const ListItem = ({navigation, singleMedia}) => {
  const {getUserById} = useUser();
  const {myFilesOnly} = useContext(MainContext);
  // const [owner, setOwner] = useState({username: 'fetching...'});
  const [additionData, setAdditionData] = useState({fullname: 'fetching...'});

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

  // console.log('type of', typeof additionData.interests);
  // console.log('type of', additionData.interests[0]);
  // var firstHobby = additionData.interests[0];
  useEffect(() => {
    fetchOwner();
  }, []);

  return (
    <ScrollView>
      <RNEListItem
        onPress={() => {
          {
            !myFilesOnly && navigation.navigate('Single', {file: singleMedia});
          }
        }}
      >
        <Card style={styles.card}>
          {!myFilesOnly && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
            >
              <Text style={styles.name}>{additionData.fullname}</Text>
              <DislikeIcon style={styles.x}></DislikeIcon>
            </View>
          )}
          {!myFilesOnly && (
            <Avatar
              containerStyle={styles.avatar}
              source={{uri: uploadsUrl + singleMedia.thumbnails.w640}}
            ></Avatar>
          )}
          {myFilesOnly && (
            <Avatar
              containerStyle={styles.avatarProfile}
              avatarStyle={{borderRadius: 10}}
              source={{uri: uploadsUrl + singleMedia.thumbnails.w640}}
            ></Avatar>
          )}

          {!myFilesOnly && (
            <View style={{flexDirection: 'row'}}>
              <AgeIcon style={styles.ageIcon}></AgeIcon>
              <Text style={styles.text}>{additionData.age}</Text>
              <Divider
                orientation="vertical"
                style={{marginTop: 12, marginRight: 10}}
              />
              <LocationIcon style={styles.icons}></LocationIcon>
              <Text style={styles.text}>{additionData.location}</Text>
              <Divider
                orientation="vertical"
                style={{marginTop: 12, marginRight: 10}}
              />
              <InterestIcon style={styles.icons}></InterestIcon>
              <Text style={styles.text}>
                {typeof additionData.interests !== 'undefined'
                  ? additionData.interests[0]
                  : ''}
              </Text>
            </View>
          )}
          {/* {myFilesOnly && (
            <Text style={styles.textDescription}>
              {singleMedia.description}
            </Text>
          )} */}
        </Card>
      </RNEListItem>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  name: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    width: '100%',
    height: 350,
    margin: 0,
    padding: 0,
    borderColor: '#EB6833',
    borderRadius: 10,
    borderWidth: 1,
  },
  avatar: {
    width: '100%',
    height: '75%',
  },
  avatarProfile: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 12,
    marginRight: 20,
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
  ageIcon: {
    marginTop: 9,
    marginRight: 5,
    marginLeft: 25,
  },
  // textDescription: {
  //   height: 50,
  //   fontSize: 20,
  //   color: 'black',
  //   backgroundColor: 'orange',
  // },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
};

export default ListItem;
