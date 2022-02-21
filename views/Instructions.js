/* eslint-disable camelcase */
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
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
import QuizIcon from '../assets/quiz.svg';
import FilterIcon from '../assets/filter.svg';
import MenuIcon from '../assets/menu.svg';
import EditIcon from '../assets/editProfile.svg';
import {Pages} from 'react-native-pages';

const Instructions = ({navigation}) => {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <Pages indicatorColor={'#EB6833'}>
          <View style={{flex: 1}}>
            <Button
              style={{alignSelf: 'flex-end'}}
              onPress={() => navigation.navigate('Main')}
            >
              Skip
            </Button>
            <Text style={styles.header}>Navigation bar</Text>
            {/* home function */}
            <Divider style={{marginBottom: 10}} />
            <Image
              source={require('../assets/hookiconActive.png')}
              style={{height: 30, width: 30, left: '10%'}}
            />
            <Divider style={{marginTop: 10, marginBottom: 10}} />
            <Text style={styles.DescribeText}>
              Find new people{'\n'}Set your preferences
            </Text>

            {/* like function */}
            <Divider style={{marginTop: 10, marginBottom: 10}} />
            <Image
              source={require('../assets/heartActive.png')}
              style={{height: 30, width: 30, left: '28%'}}
            />
            <Divider style={{marginTop: 10, marginBottom: 10}} />

            <Text style={styles.DescribeText}>See who already liked you</Text>

            {/* search function */}
            <Divider style={{marginTop: 10, marginBottom: 10}} />
            <Image
              source={require('../assets/searchActive.png')}
              style={{height: 30, width: 30, left: '43%'}}
            />
            <Divider style={{marginTop: 10, marginBottom: 10}} />

            <Text style={styles.DescribeText}>
              Search for users{'\n'}See top pick users
            </Text>

            {/* chat function */}
            <Divider style={{marginTop: 10, marginBottom: 10}} />
            <Image
              source={require('../assets/chatActive.png')}
              style={{height: 30, width: 30, left: '64%'}}
            />
            <Divider style={{marginTop: 10, marginBottom: 10}} />

            <Text style={styles.DescribeText}>
              Chat with your hooks{'\n'}Do quiz
            </Text>

            {/* profile function */}
            <Divider style={{marginTop: 10, marginBottom: 10}} />
            <Image
              source={require('../assets/userActive.png')}
              style={{height: 30, width: 30, left: '81%'}}
            />
            <Divider style={{marginTop: 15, marginBottom: 15}} />

            <Text style={styles.DescribeText}>
              View your profile{'\n'}Change your profile info
              {'\n'}Upload pictures
            </Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <Text style={styles.header}>Main page</Text>
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
                  style={{height: 80, width: 80}}
                ></Image>
                <Text style={styles.textButton}>Dislike</Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={require('../assets/InstructionsUse/image.png')}
                  style={{height: 120, width: 120}}
                ></Image>
                <Image
                  source={require('../assets/InstructionsUse/fingerClick.png')}
                  style={{height: 80, width: 80}}
                ></Image>
                <Text style={styles.textButton}>User details</Text>
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
                  style={{height: 80, width: 80}}
                ></Image>
                <Text style={styles.textButton}>Like</Text>
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
                  marginBottom: '10%',
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
                  marginBottom: '10%',
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
                  marginBottom: '10%',
                  alignItems: 'center',
                }}
              >
                <View style={styles.Button}>
                  <QuizIcon
                    height={30}
                    width={30}
                    style={{alignSelf: 'center', top: 12}}
                  ></QuizIcon>
                </View>
                <Text style={styles.DescribeText2}>
                  Quiz with your chat bubby
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: '10%',
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
                  marginBottom: '10%',
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
                  marginBottom: '10%',
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
                <Text style={styles.DescribeText2}>
                  Edit your profile{'\n'}Upload pictures
                </Text>
              </View>
            </View>
            <Button
              onPress={() => navigation.navigate('Main')}
              style={styles.ScrollUpButton}
              labelStyle={{color: 'white', textAlign: 'center', fontSize: 15}}
            >
              Ok I got this!
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
    marginTop: 5,
    marginBottom: 25,
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
    width: 200,
    height: 40,
    backgroundColor: '#DA535E',
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 20,
  },
  textButton: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 22,
  },
});

Instructions.propTypes = {
  navigation: PropTypes.object,
};

export default Instructions;
