/* eslint-disable camelcase */
import React, {useEffect, useState, useContext} from 'react';
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
import {useUser, userFavourite} from '../hooks/ApiHooks';
import AgeIcon from '../assets/age.svg';
import InterestIcon from '../assets/heart.svg';
import LocationIcon from '../assets/location.svg';
import SchoolIcon from '../assets/school.svg';
import DrinkIcon from '../assets/drink.svg';
import {Button, Card, FAB} from 'react-native-paper';
import NatIcon from '../assets/nationality.svg';
import SmokeIcon from '../assets/smoking.svg';
import PetIcon from '../assets/pet.svg';
import BabyIcon from '../assets/baby2.svg';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from '../components/ListItem';
import LikeIcon from '../assets/like.svg';
import {MainContext} from '../contexts/MainContext';
import LottieView from 'lottie-react-native';

const Single = ({route, navigation}) => {
  const animation = React.createRef();
  const {file} = route.params;
  const {postFavourite, getFavouritesByFileId, getFavourites} = userFavourite();
  const {mediaArray} = useMedia(false, file.user_id);
  const {getUserById} = useUser();
  const {getAllMediaByCurrentUserId, getMediaByUserId} = useMedia();
  const [additionData, setAdditionData] = useState({fullname: 'fetching...'});
  const [interests, setInterests] = useState('none');
  const {user, loading, setLoading, token} = useContext(MainContext);
  const [like, setLike] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [owner, setOwner] = useState();
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
  });
  const mediaData = mediaArray.filter(
    (obj) => obj.title.toLowerCase() !== 'avatar'
  );
  // console.log('file in single', file);

  const fetchOwner = async () => {
    try {
      // console.log('token in single', token);
      // console.log('singlemedia', singleMedia);
      // console.log('user_id', singleMedia.description);
      const userData = await getUserById(file.user_id, token);
      setOwner(userData.username);
      // console.log('user data', userData);
      const allData = await JSON.parse(userData.full_name);
      // console.log('addition data in listitem.js', allData);
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
      // const allLikes = await getFavouritesByFileId(file.file_id);
      const allMediaOfSingleUser = await getMediaByUserId(file.user_id);
      // console.log('all media of this single user', allMediaOfSingleUser);
      const userFilesId = allMediaOfSingleUser.map((file) => file.file_id);
      // console.log('all file id', userFilesId);
      let allLikesofSingleUser = [];
      for (const id of userFilesId) {
        const response = await getFavouritesByFileId(id);
        allLikesofSingleUser = allLikesofSingleUser.concat(response);
      }
      // console.log('all likes that single user receive', allLikesofSingleUser);
      for (let i = 0; i < allLikesofSingleUser.length; i++) {
        if (allLikesofSingleUser[i].user_id === user.user_id) {
          if (like === true) {
            console.log('you liked this user');
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
    // console.log('file id', file.file_id);
    // console.log('file', file);

    let alreadyLiked = false;

    let files = await getMediaByUserId(file.user_id);
    files = files.map((obj) => {
      return obj.file_id;
    });
    // console.log('files', files);
    const likes = await getFavourites(token);
    likes.forEach((obj) => {
      if (files.includes(obj.file_id)) alreadyLiked = true;
    });
    // console.log('already likes', alreadyLiked);

    if (alreadyLiked) {
      Alert.alert('Fail', `You have already liked ${owner}!`);
      return;
    } else {
      try {
        // console.log('file id', file.file_id);
        const response = await postFavourite(file.file_id, token);
        if (response) {
          const userFiles = await getAllMediaByCurrentUserId(token);
          // console.log('All file from current user: ', userFiles);
          setIsLiked(!isLiked);
          Alert.alert(`You liked ${owner} !`);

          const userFilesId = userFiles.map((file) => file.file_id);
          // console.log('all fileId from current user: ', userFilesId);

          // check who likes any photo from current login user
          // and then get their userId
          let allLikesofCurrentUsers = [];
          for (const id of userFilesId) {
            const response = await getFavouritesByFileId(id);
            allLikesofCurrentUsers = allLikesofCurrentUsers.concat(response);
          }
          // console.log(
          //   'all likes that current user receive',
          //   allLikesofCurrentUsers
          // );
          for (let i = 0; i < allLikesofCurrentUsers.length; i++) {
            if (allLikesofCurrentUsers[i].user_id === file.user_id) {
              setLike(true);
              // console.log('this user liked you');
            }
          }
          // console.log('users liked', response);
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
                setLoading(!loading);
                navigation.goBack();
              }}
              icon={BackIcon}
            ></Button>
            <Text style={styles.appName}>hook</Text>
            <Button disabled={true}></Button>
          </View>
          <FlatList
            ListHeaderComponent={
              <>
                <View style={styles.avatar}>
                  <Avatar
                    source={{uri: uploadsUrl + file.filename}}
                    containerStyle={styles.image}
                    avatarStyle={{borderRadius: 100}}
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
                      style={{marginTop: 12, marginRight: 5}}
                    />
                    <LocationIcon style={styles.icons}></LocationIcon>
                    <Text style={styles.text}>{additionData.location}</Text>
                    <Divider
                      orientation="vertical"
                      style={{marginTop: 12, marginRight: 5}}
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
                      style={{marginTop: 12, marginRight: 5}}
                    />
                    <SmokeIcon height={20} style={styles.icons}></SmokeIcon>
                    <Text style={styles.text}>{additionData.smoking}</Text>
                    <Divider
                      orientation="vertical"
                      style={{marginTop: 12, marginRight: 5}}
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
                      style={{marginTop: 12, marginRight: 5}}
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
                  onAnimationFinish={() => {
                    console.log('animation finished');
                  }}
                />
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
    marginRight: 30,
    fontFamily: 'Poppins_400Regular',
  },
  interests: {
    flexShrink: 1,
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
