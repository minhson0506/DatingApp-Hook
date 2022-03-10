/* eslint-disable camelcase */
import {View, Text, Alert, StyleSheet} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {LinearGradient} from 'expo-linear-gradient';
import {Button} from 'react-native-paper';
import {useUser, useMedia} from '../hooks/ApiHooks';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {uploadsUrl} from '../utils/variables';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import UpIcon from '../assets/up-arrow.svg';
import {MainContext} from '../contexts/MainContext';

const Match = ({route, navigation}) => {
  const {file} = route.params;

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
  });

  const {loading, setLoading, token} = useContext(MainContext);

  const {getUserById} = useUser();
  const {getMediaByUserId} = useMedia();
  const {mediaArray} = useMedia(true);

  const [name, setName] = useState();
  const [avatarSingleUser, setAvatarSingleUser] = useState(
    'http://placekitten.com/180'
  );
  const [avatarCurrentUser, setAvatarCurrentUser] = useState(
    'http://placekitten.com/190'
  );

  const fetchOwner = async () => {
    try {
      const userData = await getUserById(file.user_id, token);
      setName(userData.username);
      const userMedia = await getMediaByUserId(file.user_id);
      const avatarSingleUser = userMedia.find(
        (obj) => obj.title.toLowerCase() === 'avatar'
      );
      if (avatarSingleUser)
        setAvatarSingleUser(uploadsUrl + avatarSingleUser.filename);

      const avatarCurrentUser = mediaArray.find(
        (obj) => obj.title.toLowerCase() === 'avatar'
      );
      if (avatarCurrentUser)
        setAvatarCurrentUser(uploadsUrl + avatarCurrentUser.filename);
    } catch (error) {
      Alert.alert([{text: 'Load owner failed'}]);
      console.error('fetch owner error', error);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, [mediaArray]);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <LinearGradient
        // Background Linear Gradient
        colors={['#FF707B', '#FF934E']}
        style={{flex: 1, justifyContent: 'center'}}
      >
        <Text style={styles.header}>That{"'"}s a hook!</Text>
        <Text style={styles.text}>You and {name} liked each other!</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Avatar
            source={{uri: avatarCurrentUser}}
            containerStyle={styles.image}
            avatarStyle={{borderRadius: 100}}
          />
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 50,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
              alignSelf: 'center',
              zIndex: 100,
            }}
          >
            <UpIcon height={25} style={{zIndex: 2}}></UpIcon>
          </View>
          <Avatar
            source={{uri: avatarSingleUser}}
            containerStyle={styles.image}
            avatarStyle={{borderRadius: 100}}
          />
        </View>
        <Button
          uppercase={false}
          onPress={() => {
            navigation.navigate('Chat');
          }}
          style={styles.button1}
          labelStyle={styles.button1Text}
          contentStyle={{height: 50}}
        >
          Send message
        </Button>
        <Button
          labelStyle={styles.button2Text}
          uppercase={false}
          contentStyle={{height: 50}}
          onPress={() => {
            setLoading(!loading);
            navigation.navigate('Main', {screen: 'Home'});
          }}
          style={styles.button2}
        >
          Keep swiping
        </Button>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    fontSize: 26,
    color: 'white',
  },
  text: {
    fontFamily: 'Poppins_500Medium',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    marginTop: 10,
  },
  button1: {
    marginTop: '20%',
    backgroundColor: 'white',
    borderRadius: 50,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '70%',
    alignSelf: 'center',
  },
  button2: {
    marginTop: 20,
    backgroundColor: '#F26F3A',
    borderRadius: 50,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '70%',
    alignSelf: 'center',
  },
  button1Text: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  button2Text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  image: {
    width: 120,
    height: 120,
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: '10%',
    marginRight: -15,
    marginLeft: -15,
  },
});

Match.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Match;
