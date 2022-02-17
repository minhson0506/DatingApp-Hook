import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Button, Card, ListItem, Text} from 'react-native-elements';
import {PropTypes} from 'prop-types';
import List from '../components/List';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  const {getFileByTag, postTag} = useTag();
  //const [user, setUser] = useState();
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getUserByToken, getFilesByUser} = useUser();

  const fetchAvatar = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUserByToken(userToken);
      console.log('user data', userData);
      //setUser(userData);
      const files = await getFilesByUser(userToken);

      files.forEach((file) => {
        if (file.title === 'avatar' || file.title === 'Avatar') {
          setAvatar(uploadsUrl + file.filename);
        }
      });
    } catch (err) {
      console.error(err.message);
    }
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

  const additionData = JSON.parse(user.full_name); //
  console.log('addition data', additionData.fullname);
  console.log('number', additionData.age);

  const interests = () => {
    const string = '';
    additionData.interests.forEach((hobby) => {
      string += hobby + ' ';
    });

    return string;
  };

  console.log('hobby', interests);
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
          <Text>{interests}</Text>
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
