/* eslint-disable camelcase */
import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  Alert,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Text, Divider} from 'react-native-elements';
import {PropTypes} from 'prop-types';
import GlobalStyles from '../utils/GlobalStyles';
import EditIcon from '../assets/editProfile.svg';
import MenuIcon from '../assets/menu.svg';
import AgeIcon from '../assets/age.svg';
import InterestIcon from '../assets/heart.svg';
import LocationIcon from '../assets/location.svg';
import SchoolIcon from '../assets/school.svg';
import DrinkIcon from '../assets/drink.svg';
import {Card, FAB} from 'react-native-paper';
import NatIcon from '../assets/nationality.svg';
import SmokeIcon from '../assets/smoking.svg';
import PetIcon from '../assets/pet.svg';
import WorkIcon from '../assets/job.svg';
import UploadIcon from '../assets/upload.svg';
import FemaleIcon from '../assets/female.svg';
import MaleIcon from '../assets/male.svg';
import LGBT from '../assets/lgbt.svg';
import Height from '../assets/height.svg';
import Religion from '../assets/religion.svg';

import ListItem from '../components/ListItem';
import * as ImagePicker from 'expo-image-picker';
import {appId} from '../utils/variables';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {useIsFocused} from '@react-navigation/native';
import {Menu, MenuItem} from 'react-native-material-menu';
import {Button} from 'react-native-paper';

const Profile = ({navigation}) => {
  const {user, update, setUpdate, loading, token} = useContext(MainContext);

  const isFocused = useIsFocused();
  const listRef = useRef(null);

  const {mediaArray} = useMedia(true);
  const {postMedia, putMedia} = useMedia();
  const {postTag} = useTag();

  const [avatar, setAvatar] = useState(
    'https://www.linkpicture.com/q/iPhone-8-2-1.png'
  );
  const [didMount, setDidMount] = useState(false);
  const [type, setType] = useState('image');
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  let mediaData = mediaArray.filter(
    (obj) => obj.title.toLowerCase() !== 'avatar'
  );
  mediaData = mediaData.filter((obj) => obj.title.toLowerCase() !== 'deleted');

  const loadData = () => {
    mediaData = mediaArray.filter(
      (obj) => obj.title.toLowerCase() !== 'avatar'
    );
    mediaData = mediaData.filter(
      (obj) => obj.title.toLowerCase() !== 'deleted'
    );
  };

  const fetchAvatar = () => {
    const avatar = mediaArray.find(
      (obj) => obj.title.toLowerCase() === 'avatar'
    );
    if (avatar) setAvatar(uploadsUrl + avatar.filename);
  };

  const additionData = JSON.parse(user.full_name);

  const interest = () => {
    let string = '';
    additionData.interests.split(',').forEach((hobby) => {
      string += hobby.charAt(0).toUpperCase() + hobby.slice(1);
      string += ',  ';
    });
    string = string.slice(0, -3);
    return string;
  };

  const removeOldAvatar = async () => {
    const avatar = mediaArray.find(
      (obj) => obj.title.toLowerCase() === 'avatar'
    );
    if (avatar) {
      const data = {
        title: 'title',
        description: avatar.description,
      };
      try {
        await putMedia(avatar.file_id, token, data);
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
      setType(result.type);
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
      type: type + '/' + fileExtension,
    });
    // cannot change avatar to video type
    if (type === 'video') return;

    removeOldAvatar();
    try {
      const response = await postMedia(formData, token);
      const tagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        token
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
    Poppins_500Medium,
    Poppins_400Regular,
  });

  useEffect(() => {
    fetchAvatar();
    loadData();
  }, [mediaArray, isFocused, loading]);

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, []);

  if (!didMount) {
    return null;
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Menu
            style={styles.menuBox}
            visible={visible}
            anchor={
              <MenuIcon
                style={styles.menu}
                onPress={() => {
                  showMenu();
                }}
              ></MenuIcon>
            }
            onRequestClose={hideMenu}
          >
            <MenuItem
              pressColor={'#FDC592'}
              textStyle={styles.textMenu}
              onPress={() => {
                hideMenu();
                navigation.navigate('Modify user');
              }}
            >
              Account
            </MenuItem>
            <MenuItem
              pressColor={'#FDC592'}
              textStyle={styles.textMenu}
              onPress={() => {
                hideMenu();
                navigation.navigate('Instructions');
              }}
            >
              How Hook works
            </MenuItem>
          </Menu>
          <Text style={styles.appName}>hook</Text>
          <EditIcon
            style={styles.edit}
            onPress={() => {
              navigation.navigate('Edit Profile');
            }}
          ></EditIcon>
        </View>
        <FlatList
          ref={listRef}
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={styles.name}>{additionData.fullname}</Text>
                {additionData.gender === 'Female' ? (
                  <FemaleIcon
                    height={22}
                    style={{marginLeft: 5, marginTop: 10}}
                  ></FemaleIcon>
                ) : additionData.gender === 'Male' ? (
                  <MaleIcon
                    height={22}
                    style={{marginLeft: 5, marginTop: 10}}
                  ></MaleIcon>
                ) : additionData.gender === 'Nonbinary' ? (
                  <LGBT
                    height={22}
                    style={{marginLeft: 5, marginTop: 10}}
                  ></LGBT>
                ) : (
                  <></>
                )}
              </View>
              <Card style={styles.card}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <AgeIcon height={19} style={styles.icons}></AgeIcon>
                  <Text style={styles.text}>{additionData.age}</Text>

                  <Divider
                    orientation="vertical"
                    style={{marginTop: 12, marginRight: 10}}
                  />
                  <Height height={20} style={styles.icons}></Height>
                  <Text style={styles.text}>{additionData.height}</Text>
                  <Divider
                    orientation="vertical"
                    style={{marginTop: 12, marginRight: 10}}
                  />
                  <LocationIcon style={styles.icons}></LocationIcon>
                  <Text style={styles.text}>{additionData.location}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <DrinkIcon style={styles.icons}></DrinkIcon>
                  <Text style={styles.text}>{additionData.drinking}</Text>
                  <Divider
                    orientation="vertical"
                    style={{marginTop: 12, marginRight: 5}}
                  />
                  <SmokeIcon height={20} style={styles.icons}></SmokeIcon>
                  <Text style={styles.text}>{additionData.smoking}</Text>
                  <Divider
                    orientation="vertical"
                    style={{marginTop: 12, marginRight: 5}}
                  />
                  <PetIcon height={20} style={styles.icons}></PetIcon>
                  <Text style={styles.text}>{additionData.pet}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <NatIcon style={styles.icons}></NatIcon>
                  <Text style={styles.text}>{additionData.nationality}</Text>
                  <Divider
                    orientation="vertical"
                    style={{marginTop: 12, marginRight: 5}}
                  />
                  <Religion height={20} style={styles.icons}></Religion>
                  <Text style={styles.text}>
                    {additionData.religious_beliefs}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  {additionData.school.toLowerCase() === 'none' ? (
                    <>
                      <SchoolIcon style={styles.icons}></SchoolIcon>
                      <Text style={styles.text}>
                        {additionData.education_level}
                      </Text>
                    </>
                  ) : additionData.education_level.toLowerCase() === 'none' ? (
                    <>
                      <SchoolIcon style={styles.icons}></SchoolIcon>
                      <Text style={styles.text}>{additionData.school}</Text>
                    </>
                  ) : (
                    <>
                      <SchoolIcon style={styles.icons}></SchoolIcon>
                      <Text style={styles.text}>
                        {additionData.education_level +
                          ', ' +
                          additionData.school}
                      </Text>
                    </>
                  )}
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  {additionData.work === 'none' ||
                  additionData.work === 'None' ? (
                    <>
                      <WorkIcon height={22} style={styles.icons}></WorkIcon>
                      <Text style={styles.text}>{additionData.job}</Text>
                    </>
                  ) : additionData.job === 'none' ||
                    additionData.job === 'None' ? (
                    <>
                      <WorkIcon height={22} style={styles.icons}></WorkIcon>
                      <Text style={styles.text}>{additionData.work}</Text>
                    </>
                  ) : (
                    <>
                      <WorkIcon height={22} style={styles.icons}></WorkIcon>
                      <Text style={styles.text}>
                        {additionData.job + ' at ' + additionData.work}
                      </Text>
                    </>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    width: '100%',
                  }}
                >
                  <InterestIcon style={styles.icons}></InterestIcon>
                  <Text style={[styles.text, styles.interests]}>
                    {interest()}
                  </Text>
                </View>
              </Card>
            </>
          }
          ListFooterComponent={
            mediaData.length >= 4 ? (
              <Button
                onPress={() => {
                  listRef.current.scrollToOffset({offset: 0, animated: true});
                }}
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: '#82008F',
                  borderRadius: 5,
                }}
              >
                Back to top
              </Button>
            ) : (
              <></>
            )
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

        <FAB
          style={styles.fab}
          medium
          icon={UploadIcon}
          onPress={() => navigation.navigate('Upload')}
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  menu: {
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  menuBox: {
    marginTop: 45,
    marginLeft: 10,
    borderRadius: 5,
  },
  textMenu: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
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
    marginRight: 10,
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
    marginTop: 10,
    fontFamily: 'Poppins_600SemiBold',
  },
  text: {
    fontSize: 16,
    marginTop: 17,
    marginRight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  interests: {
    flexWrap: 'wrap',
  },
  icons: {
    marginTop: 17,
    marginRight: 5,
    marginLeft: 15,
    marginBottom: 10,
  },
  card: {
    width: '90%',
    marginBottom: 20,
    paddingBottom: 15,
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
  fab: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    backgroundColor: 'white',
    paddingBottom: 3,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default Profile;
