/* eslint-disable camelcase */
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  Alert,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
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
import SmokeIcon from '../assets/smoking.svg';
import PetIcon from '../assets/pet.svg';
import BabyIcon from '../assets/baby2.svg';

import ListItem from '../components/ListItem';
import * as ImagePicker from 'expo-image-picker';
import {appId} from '../utils/variables';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {useIsFocused} from '@react-navigation/native';

const Profile = ({navigation}) => {
  const {user, update, setUpdate} = useContext(MainContext);
  const isFocused = useIsFocused();
  const [avatar, setAvatar] = useState(
    'https://www.linkpicture.com/q/iPhone-8-2-1.png'
  );
  const {mediaArray} = useMedia(true);
  const {postMedia, putMedia} = useMedia();
  const {postTag} = useTag();

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
  }, [mediaArray, isFocused]);

  // console.log('Profile', user);

  const additionData = JSON.parse(user.full_name);
  // console.log('addition data full name', additionData.fullname);
  // console.log('number', additionData.age);

  const interest = () => {
    let string = '';
    additionData.interests.split(',').forEach((hobby) => {
      string += hobby;
      string += ' ';
    });
    return string;
  };

  const removeOldAvatar = async () => {
    const avatar = mediaArray.find(
      (obj) => obj.title.toLowerCase() === 'avatar'
    );
    console.log('avatar in formdata', avatar);
    if (avatar) {
      const data = {
        title: 'title',
        description: avatar.description,
      };
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        await putMedia(avatar.file_id, userToken, data);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const changeProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.cancelled) {
      setAvatar(result.uri);
    }
    const formData = new FormData();
    formData.append('title', 'avatar');
    formData.append('description', '');
    const filename = result.uri.split('/').pop();
    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    formData.append('file', {
      uri: result.uri,
      name: filename,
      type: 'image' + '/' + fileExtension,
    });
    removeOldAvatar();
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await postMedia(formData, userToken);
      const tagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        userToken
      );
      tagResponse &&
        Alert.alert('Upload', 'Updated avatar successfully', [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Profile');
            },
          },
        ]);
    } catch (error) {
      console.error(error);
    }
  };

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
          <MenuIcon
            style={styles.menu}
            onPress={() => {
              navigation.navigate('Modify user');
            }}
          ></MenuIcon>
          <Text style={styles.appName}>hook</Text>
          <EditIcon
            style={styles.edit}
            onPress={() => {
              navigation.navigate('Upload');
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
                  onPress={changeProfilePicture}
                />
              </View>
              <Text style={styles.name}>{additionData.fullname}</Text>
              <Card style={styles.card}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  <AgeIcon height={19} style={styles.icons}></AgeIcon>
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
                  <PetIcon height={20} style={styles.icons}></PetIcon>
                  <Text style={styles.text}>{additionData.pet}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  <DrinkIcon style={styles.icons}></DrinkIcon>
                  <Text style={styles.text}>{additionData.drinking}</Text>
                  <Divider
                    orientation="vertical"
                    style={{marginTop: 12, marginRight: 10}}
                  />
                  <SmokeIcon height={20} style={styles.icons}></SmokeIcon>
                  <Text style={styles.text}>{additionData.smoking}</Text>
                  <Divider
                    orientation="vertical"
                    style={{marginTop: 12, marginRight: 10}}
                  />
                  <BabyIcon height={22} style={styles.icons}></BabyIcon>
                  <Text style={styles.text}>{additionData.family_plan}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  <SchoolIcon style={styles.icons}></SchoolIcon>
                  <Text style={styles.text}>{additionData.school}</Text>
                  <Divider
                    orientation="vertical"
                    style={{marginTop: 12, marginRight: 10}}
                  />
                  <NatIcon style={styles.icons}></NatIcon>
                  <Text style={styles.text}>{additionData.nationality}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
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
        <Button
          title={'Instructions'}
          onPress={() => navigation.navigate('Instructions')}
        />
        <Button
          title={'Interests'}
          onPress={() => navigation.navigate('Interests')}
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
    marginTop: 17,
    marginRight: 5,
    marginLeft: 15,
    marginBottom: 10,
  },
  card: {
    width: '90%',
    height: 200,
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
