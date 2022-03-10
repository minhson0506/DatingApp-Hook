/* eslint-disable camelcase */
import React, {useEffect, useState, useContext, useRef} from 'react';
import {StyleSheet, View, SafeAreaView, Alert, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Text, Divider} from 'react-native-elements';
import BackIcon from '../assets/back.svg';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {useUser, useFavourite} from '../hooks/ApiHooks';
import AgeIcon from '../assets/age.svg';
import InterestIcon from '../assets/heart.svg';
import LocationIcon from '../assets/location.svg';
import SchoolIcon from '../assets/school.svg';
import DrinkIcon from '../assets/drink.svg';
import {Button, Card, FAB} from 'react-native-paper';
import NatIcon from '../assets/nationality.svg';
import SmokeIcon from '../assets/smoking.svg';
import PetIcon from '../assets/pet.svg';
import WorkIcon from '../assets/job.svg';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from '../components/ListItem';
import LikeIcon from '../assets/like.svg';
import {MainContext} from '../contexts/MainContext';
import LottieView from 'lottie-react-native';
import FemaleIcon from '../assets/female.svg';
import MaleIcon from '../assets/male.svg';
import LGBT from '../assets/lgbt.svg';
import Height from '../assets/height.svg';
import Religion from '../assets/religion.svg';

const Single = ({route, navigation}) => {
  const {file} = route.params;

  const animation = React.createRef();
  const listRef = useRef(null);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
  });

  const {user, token} = useContext(MainContext);

  const {postFavourite, getFavouritesByFileId, getFavourites} = useFavourite();
  const {mediaArray} = useMedia(false, file.user_id);
  const {getUserById} = useUser();
  const {getAllMediaByCurrentUserId, getMediaByUserId} = useMedia();

  const [additionData, setAdditionData] = useState({fullname: 'fetching...'});
  const [interests, setInterests] = useState('none');
  const [like, setLike] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [owner, setOwner] = useState();

  const mediaData = mediaArray.filter((obj) => {
    return (
      obj.title.toLowerCase() !== 'avatar' &&
      obj.title.toLowerCase() !== 'deleted'
    );
  });

  const fetchOwner = async () => {
    try {
      const userData = await getUserById(file.user_id, token);
      setOwner(userData.username);
      const allData = await JSON.parse(userData.full_name);
      setAdditionData(allData);
      let string = '';
      allData.interests.split(',').forEach((hobby) => {
        string = string + hobby.charAt(0).toUpperCase() + hobby.slice(1);
        string += ',  ';
      });
      string = string.slice(0, -3);
      setInterests(string);
    } catch (error) {
      Alert.alert([{text: 'Load owner failed'}]);
      console.error('fetch owner error', error);
      setAdditionData({fullname: '[not available]'});
    }
  };

  const checkLike = async () => {
    try {
      // get all favourite of this single user's file
      const allMediaOfSingleUser = await getMediaByUserId(file.user_id);
      const userFilesId = allMediaOfSingleUser.map((file) => file.file_id);
      let allLikesofSingleUser = [];
      for (const id of userFilesId) {
        const response = await getFavouritesByFileId(id);
        allLikesofSingleUser = allLikesofSingleUser.concat(response);
      }
      for (let i = 0; i < allLikesofSingleUser.length; i++) {
        if (allLikesofSingleUser[i].user_id === user.user_id) {
          if (like === true) {
            navigation.navigate('Match', {file});
            return;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const likeUser = async () => {
    let alreadyLiked = false;

    let files = await getMediaByUserId(file.user_id);
    files = files.map((obj) => {
      return obj.file_id;
    });
    const likes = await getFavourites(token);
    likes.forEach((obj) => {
      if (files.includes(obj.file_id)) alreadyLiked = true;
    });

    if (alreadyLiked) {
      Alert.alert('Fail', `You have already liked ${owner}!`);
      return;
    } else {
      try {
        const response = await postFavourite(file.file_id, token);
        if (response) {
          const userFiles = await getAllMediaByCurrentUserId(token);
          setIsLiked(!isLiked);
          Alert.alert(`You liked ${owner} !`);
          const userFilesId = userFiles.map((file) => file.file_id);

          // check who likes any photo from current login user
          // and then get their userId
          let allLikesofCurrentUsers = [];
          for (const id of userFilesId) {
            const response = await getFavouritesByFileId(id);
            allLikesofCurrentUsers = allLikesofCurrentUsers.concat(response);
          }
          for (let i = 0; i < allLikesofCurrentUsers.length; i++) {
            if (allLikesofCurrentUsers[i].user_id === file.user_id) {
              setLike(true);
            }
          }
        }
      } catch (error) {
        Alert.alert('Fail', `You have already liked ${owner}!`);
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  useEffect(() => {
    checkLike();
  }, [like]);

  useEffect(() => {
    animation.current?.play(0, 210);
  }, [isLiked]);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button
              style={styles.back}
              onPress={() => {
                navigation.goBack();
              }}
              icon={BackIcon}
            ></Button>
            <Text style={styles.appName}>hook</Text>
            <Button disabled={true}></Button>
          </View>
          <FlatList
            ref={listRef}
            ListHeaderComponent={
              <>
                <View style={styles.avatar}>
                  <Avatar
                    source={{uri: uploadsUrl + file.filename}}
                    containerStyle={styles.image}
                    avatarStyle={{borderRadius: 100}}
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
                    {additionData.school === 'none' ||
                    additionData.school === 'None' ? (
                      <>
                        <SchoolIcon style={styles.icons}></SchoolIcon>
                        <Text style={styles.text}>
                          {additionData.education_level}
                        </Text>
                      </>
                    ) : additionData.education_level === 'none' ||
                      additionData.education_level === 'None' ? (
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
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <InterestIcon style={styles.icons}></InterestIcon>
                    <Text style={[styles.text, styles.interests]}>
                      {interests}
                    </Text>
                  </View>
                </Card>
                <LottieView
                  ref={animation}
                  // style={{marginTop: 100, marginLeft: 40}}
                  resizeMode="cover"
                  source={require('../assets/animation/heart.json')}
                  autoPlay={false}
                  loop={false}
                  // onAnimationFinish={() => {
                  //   console.log('animation finished');
                  // }}
                />
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
                disableDelete={true}
              ></ListItem>
            )}
          ></FlatList>

          <FAB style={styles.fab} medium icon={LikeIcon} onPress={likeUser} />
        </SafeAreaView>
        <StatusBar style="auto"></StatusBar>
      </>
    );
  }
};

const styles = StyleSheet.create({
  back: {
    marginLeft: 10,
    marginTop: 10,
  },
  appName: {
    fontSize: 40,
    color: '#EB6833',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 5,
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
    marginTop: 10,
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
    marginRight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  interests: {
    flexWrap: 'wrap',
  },
  icons: {
    marginTop: 17,
    marginRight: 10,
    marginLeft: 15,
    marginBottom: 10,
  },
  card: {
    width: '90%',
    marginBottom: 20,
    paddingBottom: 10,
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
    right: 15,
    bottom: 20,
    backgroundColor: 'white',
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
