import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Button, Card, ListItem, Text} from 'react-native-elements';
import {PropTypes} from 'prop-types';
import List from '../components/List';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  //const [user, setUser] = useState();
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {mediaArray} = useMedia(true);
  console.log('media array profiler', mediaArray);

  // const findElement = (array, name) => {
  //   return array.find((element) => element.title.toLowerCase() === name);
  // };

  const fetchAvatar = () => {
    const avatar = mediaArray.find(
      (obj) => obj.title.toLowerCase() === 'avatar'
    );
    console.log('avatar', avatar);
    if (avatar) setAvatar(uploadsUrl + avatar.filename);
  };

  useEffect(() => {
    fetchAvatar();
  }, [mediaArray]);

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
    } catch (err) {
      console.error(err);
    }
    setIsLoggedIn(false);
  };

  console.log('Profile', user);

  const additionData = JSON.parse(user.full_name);
  console.log('addition data full name', additionData.fullname);
  console.log('number', additionData.age);

  const interest = () => {
    let string = '';
    additionData.interests.forEach((hobby) => {
      string += hobby;
      string += ' ';
    });

    return string;
  };
  console.log('hobby', interest());

  return (
    <ScrollView>
      <Card>
        <Card.Title>
          <Text h1>{user.username}</Text>
        </Card.Title>
        <Card.Image
          source={{uri: avatar}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator></ActivityIndicator>}
        />
        <ListItem>
          <Avatar icon={{name: 'email', color: 'black'}} />
          <Text>{user.email}</Text>
        </ListItem>
        <ListItem>
          <Avatar icon={{name: 'user', type: 'font-awesome', color: 'black'}} />
          <Text>{additionData.fullname}</Text>
        </ListItem>
        <ListItem>
          <Avatar icon={{name: 'user', type: 'font-awesome', color: 'black'}} />
          <Text>{additionData.location}</Text>
        </ListItem>
        <ListItem>
          <Avatar icon={{name: 'user', type: 'font-awesome', color: 'black'}} />
          <Text>{additionData.school}</Text>
        </ListItem>
        <ListItem>
          <Avatar icon={{name: 'user', type: 'font-awesome', color: 'black'}} />
          <Text>{interest()}</Text>
        </ListItem>
        <Button title={'Logout'} onPress={logOut} />
        <Button
          title="Modify user"
          onPress={() => {
            navigation.navigate('Modify user');
          }}
        ></Button>
      </Card>

      <List navigation={navigation} myFilesOnly={true}></List>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {width: '100%', height: undefined, aspectRatio: 1},
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
