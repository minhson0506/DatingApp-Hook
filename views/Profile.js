import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Button, Card, ListItem, Text} from 'react-native-elements';
import {PropTypes} from 'prop-types';
import List from '../components/List';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  const {getFileByTag, postTag} = useTag();
  //const [user, setUser] = useState();
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {mediaArray} = useMedia(true);
  console.log('media array', mediaArray);

  const findElement = (array, firstName, secondName) => {
    return array.find((element) => {
      return element.title === firstName || element.title === secondName;
    });
  };

  const fetchAvatar = async () => {
    const avatar = findElement(mediaArray, 'avatar', 'Avatar');
    if (avatar) setAvatar(uploadsUrl + avatar.filename);
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

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
