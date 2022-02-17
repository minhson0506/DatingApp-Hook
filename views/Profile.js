import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, ScrollView} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Button, Card, ListItem, Text} from 'react-native-elements';
import {PropTypes} from 'prop-types';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  const {getFileByTag, postTag} = useTag();
  const [avatar, setAvatar] = useState('http://placekitten.com/640');

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFileByTag('avatar_' + user.user_id);
      const avatar = avatarArray.pop();
      console.log('TAG' + JSON.stringify(avatar));
      setAvatar(uploadsUrl + avatar.filename);
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
          <Text>{user.full_name}</Text>
        </ListItem>
        <Button title={'Logout'} onPress={logOut} />
        <Button
          title="Modify user"
          onPress={() => {
            navigation.navigate('Modify user');
          }}
        ></Button>
        <Button
          title="instructions"
          onPress={() => {
            navigation.navigate('Instructions');
          }}
        ></Button>
      </Card>
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
