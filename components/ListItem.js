import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Avatar,
  ButtonGroup,
  Card,
  ListItem as RNEListItem,
  Text,
} from 'react-native-elements';
import {Alert, Image, ScrollView, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';

const ListItem = ({navigation, singleMedia, myFilesOnly}) => {
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({username: 'fetching...'});
  const [additionData, setAdditionData] = useState({fullname: 'fetching...'});

  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // console.log('singlemedia', singleMedia);
      // console.log('user_id', singleMedia.user_id);
      const userData = await getUserById(singleMedia.user_id, token);
      console.log('user data', userData);
      setOwner(userData);
      const allData = JSON.parse(userData.full_name);
      console.log('addition data in listitem.js', allData);
      setAdditionData(allData);
    } catch (error) {
      Alert.alert([{text: 'Load owner failed'}]);
      console.error('fetch owner error', error);
      setOwner({username: '[not available]'});
      setAdditionData({fullname: '[not available]'});
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  return (
    <RNEListItem
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      {!myFilesOnly && <Text style={styles.name}>{additionData.fullname}</Text>}
      <Image
        style={styles.avatar}
        source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
      ></Image>
      {!myFilesOnly && (
        <View style={{flexDirection: 'row'}}>
          <Text>Age {additionData.age}</Text>
          <Text>Location {additionData.location}</Text>
          <Text>Hobby {additionData.interests}</Text>
        </View>
      )}
      {myFilesOnly && (
        <ButtonGroup
          onPress={(index) => {
            if (index === 0) {
              navigation.navigate('Modify', {file: singleMedia});
            } else {
              doDelete();
            }
          }}
          buttons={['Modify', 'Delete']}
          rounded
        ></ButtonGroup>
      )}
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  name: {
    // backgroundColor: 'blue',
    margin: 0,
  },
  avatar: {
    margin: 0,
    width: '100%',
    height: '75%',
    resizeMode: 'stretch',
  },
  card: {
    flex: 1,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
