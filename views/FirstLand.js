/* eslint-disable camelcase */
import {Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import React from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import PropTypes from 'prop-types';
import Arrow from '../assets/up-arrow.svg';

const FirstLand = ({navigation}) => {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <LinearGradient
        // Background Linear Gradient
        colors={['#FF707B', '#FF934E']}
        style={{flex: 1}}
      >
        <Text style={styles.appName}>hook</Text>
        <Text style={styles.header}>That's a hook!</Text>
        <Text style={styles.text}>
          By register and sign in for Hook, you agree to our Terms of Service.
          Learn how we process your data in our Privacy Policy and Cookies
          Policy.
        </Text>
        <Button
          onPress={() => {
            navigation.navigate('Login');
          }}
          icon={<Arrow />}
          // title={'Create account'}
          buttonStyle={styles.button1}
          // titleStyle={styles.buttonTitle}
        ></Button>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  appName: {
    textAlign: 'center',
    fontSize: 60,
    marginTop: '40%',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 10,
    color: 'white',
  },
  header: {
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    marginTop: '5%',
  },
  text: {
    width: '85%',
    fontFamily: 'Poppins_500Medium',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
    marginTop: '50%',
  },
  button1: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: '8%',
    marginBottom: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  // buttonTitle: {
  //   fontFamily: 'Poppins_500Medium',
  //   color: 'black',
  // },
});

FirstLand.propTypes = {
  navigation: PropTypes.object,
};

export default FirstLand;
