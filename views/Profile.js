/* eslint-disable camelcase */
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Button, Text, Divider} from 'react-native-elements';
import {PropTypes} from 'prop-types';
import GlobalStyles from '../utils/GlobalStyles';
import EditIcon from '../assets/editProfile.svg';
import MenuIcon from '../assets/menu.svg';
import AgeIcon from '../assets/age.svg';
import InterestIcon from '../assets/heart.svg';
import LocationIcon from '../assets/location.svg';
import SchoolIcon from '../assets/school.svg';
import DrinkIcon from '../assets/drink.svg';
import {Card} from 'react-native-paper';
import NatIcon from '../assets/nationality.svg';
import ListItem from '../components/ListItem';

import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const Profile = ({navigation}) => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  // const [user, setUser] = useState();
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {mediaArray} = useMedia(true);

  const mediaData = mediaArray.filter(
    (obj) => obj.title.toLowerCase() !== 'avatar'
  );
  //   console.log('media array in ListItem', mediaArray);
  // console.log('media array profiler', mediaArray);

  const fetchAvatar = () => {
    // console.log('myfileonly in profile', myFilesOnly);
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

  // console.log('Profile', user);

  const additionData = JSON.parse(user.full_name);
  // console.log('addition data full name', additionData.fullname);
  // console.log('number', additionData.age);

  const interest = () => {
    let string = '';
    additionData.interests.forEach((hobby) => {
      string += hobby;
      string += ' ';
    });

    return string;
  };
  console.log('hobby', interest());

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MenuIcon style={styles.menu}></MenuIcon>
          <Text style={styles.appName}>hook</Text>
          <EditIcon
            style={styles.edit}
            onPress={() => {
              navigation.navigate('Modify user');
            }}
          ></EditIcon>
        </View>
        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.avatar}>
                <Avatar
                  source={{uri: avatar}}
                  containerStyle={styles.image}
                  avatarStyle={{borderRadius: 100}}
                  PlaceholderContent={<ActivityIndicator></ActivityIndicator>}
                />
              </View>
              <Text style={styles.name}>{additionData.fullname}</Text>
              <Card style={styles.card}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
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
                  <DrinkIcon style={styles.icons}></DrinkIcon>
                  <Text style={styles.text}>{additionData.drinking}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <SchoolIcon style={styles.icons}></SchoolIcon>
                  <Text style={styles.text}>{additionData.school}</Text>
                  <Divider
                    orientation="vertical"
                    style={{marginTop: 12, marginRight: 10}}
                  />
                  <NatIcon style={styles.icons}></NatIcon>
                  <Text style={styles.text}>{additionData.nationality}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <InterestIcon style={styles.icons}></InterestIcon>
                  <Text style={styles.text}>{interest()}</Text>
                </View>
              </Card>
            </>
          }
          data={mediaData}
          keyExtractor={(item) => item.file_id.toString()}
          renderItem={({item}) => (
            <ListItem
              navigation={navigation}
              singleMedia={item}
              myFilesOnly={true}
            ></ListItem>
          )}
          // myFilesOnly={true}
        ></FlatList>
        <Button title={'Logout'} onPress={logOut} />
        <Button
          title={'Instructions'}
          onPress={() => navigation.navigate('Instructions')}
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  menu: {
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  appName: {
    fontSize: 40,
    fontFamily: 'Poppins_700Bold',
    color: '#EB6833',
    letterSpacing: 5,
  },
  edit: {
    marginTop: 10,
    marginBottom: 20,
    marginRight: 15,
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
    fontFamily: 'Poppins_600SemiBold',
  },
  text: {
    fontSize: 16,
    marginTop: 17,
    marginRight: 30,
    fontFamily: 'Poppins_400Regular',
  },
  icons: {
    marginTop: 15,
    marginRight: 5,
    marginLeft: 15,
    marginBottom: 10,
  },
  ageIcon: {
    marginTop: 12,
    marginRight: 5,
    marginLeft: 15,
    marginBottom: 10,
  },
  card: {
    width: '90%',
    height: 150,
    marginBottom: 20,
    padding: 0,
    borderColor: '#FCF2F2',
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default Profile;
