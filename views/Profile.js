import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Button, Card, ListItem, Text} from 'react-native-elements';
import {PropTypes} from 'prop-types';
import List from '../components/List';
import GlobalStyles from '../utils/GlobalStyles';
import EditIcon from '../assets/editProfile.svg';
import MenuIcon from '../assets/menu.svg';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  // const [user, setUser] = useState();
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
    <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
      <View style={{flexDirection: 'row'}}>
        <MenuIcon style={styles.menu}></MenuIcon>
        <Text style={styles.appName}>hook</Text>
        <EditIcon
          style={styles.edit}
          onPress={() => {
            navigation.navigate('Modify user');
          }}
        ></EditIcon>
      </View>
      <ScrollView>
        <View style={styles.avatar}>
          <Avatar
            source={{uri: avatar}}
            containerStyle={styles.image}
            avatarStyle={{borderRadius: 100}}
            PlaceholderContent={<ActivityIndicator></ActivityIndicator>}
          />
        </View>
        <Text style={styles.name}>{additionData.fullname}</Text>
        <Card>
          <ListItem>
            <Avatar icon={{name: 'email', color: 'black'}} />
            <Text>{user.email}</Text>
          </ListItem>
          <ListItem>
            <Avatar
              icon={{name: 'user', type: 'font-awesome', color: 'black'}}
            />
            <Text>{additionData.fullname}</Text>
          </ListItem>
          <ListItem>
            <Avatar
              icon={{name: 'user', type: 'font-awesome', color: 'black'}}
            />
            <Text>{additionData.location}</Text>
          </ListItem>
          <ListItem>
            <Avatar
              icon={{name: 'user', type: 'font-awesome', color: 'black'}}
            />
            <Text>{additionData.school}</Text>
          </ListItem>
          <ListItem>
            <Avatar
              icon={{name: 'user', type: 'font-awesome', color: 'black'}}
            />
            <Text>{interest()}</Text>
          </ListItem>
        </Card>

        <List
          scrollEnabled="false"
          navigation={navigation}
          myFilesOnly={true}
        ></List>
        <Button title={'Logout'} onPress={logOut} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menu: {
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#EB6833',
    marginLeft: '25%',
  },
  edit: {
    marginLeft: '25%',
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    width: '90%',
    height: '90%',
    alignSelf: 'center',
    top: 7,
  },
  avatar: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderWidth: 1.5,
    borderRadius: 100,
    borderColor: '#EB6432',
  },
  name: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
