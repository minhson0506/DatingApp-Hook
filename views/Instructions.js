/* eslint-disable camelcase */
import {View, Text, StyleSheet} from 'react-native';
import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {Image, Divider} from 'react-native-elements';
import {Button} from 'react-native-paper';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import ReloadIcon from '../assets/reload.svg';
import LikeIcon from '../assets/up-arrow.svg';
import UploadIcon from '../assets/upload.svg';
import FilterIcon from '../assets/filter.svg';
import MenuIcon from '../assets/menu.svg';
import EditIcon from '../assets/editProfile.svg';
import {Pages} from 'react-native-pages';
import {MainContext} from '../contexts/MainContext';

const Instructions = ({navigation}) => {
  const {instruction} = useContext(MainContext);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <View />;
  } else {
    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <Pages indicatorColor={'#EB6833'}>
          <View
            style={{
              flex: 1,
              resizeMode: 'contain',
              justifyContent: 'space-evenly',
              marginBottom: 20,
            }}
          >
            <Button
              style={{alignSelf: 'flex-end'}}
              onPress={() => navigation.navigate('Main')}
            >
              Skip
            </Button>
            <Text style={styles.header}>Navigation bar</Text>
            {/* home function */}
            <Divider style={{marginBottom: 5}} />
            <Image
              source={require('../assets/hookiconActive.png')}
              style={{height: 30, width: 30, left: '10%'}}
            />
            <Divider style={{marginTop: 5, marginBottom: 5}} />
            <Text style={styles.DescribeText}>
              Home page{'\n'}Find new people
            </Text>

            {/* like function */}
            <Divider style={{marginTop: 5, marginBottom: 5}} />
            <Image
              source={require('../assets/heartActive.png')}
              style={{height: 30, width: 30, left: '28%'}}
            />
            <Divider style={{marginTop: 5, marginBottom: 5}} />

            <Text style={styles.DescribeText}>See who already liked you</Text>

            {/* search function */}
            <Divider style={{marginTop: 5, marginBottom: 5}} />
            <Image
              source={require('../assets/searchActive.png')}
              style={{height: 30, width: 30, left: '43%'}}
            />
            <Divider style={{marginTop: 5, marginBottom: 5}} />

            <Text style={styles.DescribeText}>
              Search for users{'\n'}See top pick users
            </Text>

            {/* chat function */}
            <Divider style={{marginTop: 5, marginBottom: 5}} />
            <Image
              source={require('../assets/chatActive.png')}
              style={{height: 30, width: 30, left: '64%'}}
            />
            <Divider style={{marginTop: 5, marginBottom: 5}} />

            <Text style={styles.DescribeText}>Chat with your hooks</Text>

            {/* profile function */}
            <Divider style={{marginTop: 5, marginBottom: 5}} />
            <Image
              source={require('../assets/userActive.png')}
              style={{height: 30, width: 30, left: '81%'}}
            />
            <Divider style={{marginTop: 5, marginBottom: 5}} />

            <Text style={styles.DescribeText}>
              Profile page{'\n'}Change your profile info
              {'\n'}Upload pictures
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={styles.header}>Home page</Text>
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginRight: 20,
                  }}
                >
                  <Image
                    source={require('../assets/InstructionsUse/swipeL.png')}
                    style={{height: 70, width: 70}}
                  ></Image>
                  <Image
                    source={require('../assets/InstructionsUse/fingerClick.png')}
                    style={{height: 70, width: 70}}
                  ></Image>
                  <Text style={styles.textButton}>Info</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={require('../assets/InstructionsUse/image.png')}
                    style={{height: 120, width: 120, alignSelf: 'center'}}
                  ></Image>
                  <Text style={styles.textButton}>No press</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}
                >
                  <Image
                    source={require('../assets/InstructionsUse/swipeR.png')}
                    style={{height: 70, width: 70}}
                  ></Image>
                  <Image
                    source={require('../assets/InstructionsUse/fingerClick.png')}
                    style={{height: 70, width: 70}}
                  ></Image>
                  <Text style={styles.textButton}>Like</Text>
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.header}>Profile page</Text>
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={require('../assets/InstructionsUse/image.png')}
                    style={{
                      height: 120,
                      width: 120,
                      alignSelf: 'center',
                    }}
                  ></Image>
                  <Image
                    source={require('../assets/InstructionsUse/fingerClick.png')}
                    style={{
                      height: 80,
                      width: 80,
                    }}
                  ></Image>
                  <Text style={styles.textButton}>
                    Long press: Delete image
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <Text style={styles.header}>Buttons</Text>

            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 25,
                  alignItems: 'center',
                }}
              >
                <View style={styles.Button}>
                  <LikeIcon
                    height={30}
                    width={30}
                    style={{alignSelf: 'center', top: 12}}
                  ></LikeIcon>
                </View>
                <Text style={styles.DescribeText2}>Like</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 25,
                  alignItems: 'center',
                }}
              >
                <View style={styles.Button}>
                  <ReloadIcon
                    height={30}
                    width={30}
                    style={{alignSelf: 'center', top: 12}}
                  ></ReloadIcon>
                </View>
                <Text style={styles.DescribeText2}>Reload 10 new users</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 25,
                  alignItems: 'center',
                }}
              >
                <View style={styles.Button}>
                  <MenuIcon
                    height={30}
                    width={30}
                    style={{alignSelf: 'center', top: 12}}
                  ></MenuIcon>
                </View>
                <Text style={styles.DescribeText2}>
                  Menu{'\n'}Edit account info
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 25,
                  alignItems: 'center',
                }}
              >
                <View style={styles.Button}>
                  <FilterIcon
                    height={30}
                    width={30}
                    style={{alignSelf: 'center', top: 12}}
                  ></FilterIcon>
                </View>
                <Text style={styles.DescribeText2}>
                  Set preferences to find{'\n'}your perfect match
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 25,
                  alignItems: 'center',
                }}
              >
                <View style={styles.Button}>
                  <UploadIcon
                    height={30}
                    width={30}
                    style={{alignSelf: 'center', top: 12}}
                  ></UploadIcon>
                </View>
                <Text style={styles.DescribeText2}>Upload your pictures</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 25,
                  alignItems: 'center',
                }}
              >
                <View style={styles.Button}>
                  <EditIcon
                    height={30}
                    width={30}
                    style={{alignSelf: 'center', top: 14, left: 4}}
                  ></EditIcon>
                </View>
                <Text style={styles.DescribeText2}>Edit your profile</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={styles.textInfo}>
              Remember to add your information and profile picture so that
              others can find you!
            </Text>
            <Button
              uppercase={false}
              onPress={() => {
                instruction
                  ? navigation.navigate('Main', {screen: 'Profile'})
                  : navigation.goBack();
              }}
              style={styles.ScrollUpButton}
              labelStyle={{textAlign: 'center', fontSize: 16}}
            >
              OK I got this!
            </Button>
          </View>
          {/* </ScrollView> */}
        </Pages>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  header: {
    color: '#DA535E',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: '5%',
    fontFamily: 'Poppins_600SemiBold',
  },
  DescribeText: {
    fontSize: 20,
    marginLeft: 20,
    lineHeight: 30,
    marginBottom: 10,
    fontFamily: 'Poppins_500Medium',
  },
  DescribeText2: {
    fontSize: 20,
    marginLeft: 20,
    fontFamily: 'Poppins_500Medium',
  },
  Button: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: 'white',
    borderColor: '#FCF2F2',
    borderWidth: 1,
    shadowColor: '0 4 4 rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.8,
  },
  ScrollUpButton: {
    alignSelf: 'center',
    width: '40%',
    borderRadius: 10,
    marginTop: '50%',
    borderWidth: 1,
    borderColor: '#82008F',
  },
  textButton: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 22,
    marginTop: 5,
  },
  textInfo: {
    textAlign: 'center',
    fontSize: 22,
    width: '90%',
    color: '#DA535E',
    fontFamily: 'Poppins_600SemiBold',
  },
});

Instructions.propTypes = {
  navigation: PropTypes.object,
};

export default Instructions;
