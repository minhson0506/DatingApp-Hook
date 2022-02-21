import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {Image, Divider} from 'react-native-elements';
import {Button} from 'react-native-paper';

const Instructions = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1}}>
          <Text style={styles.Title}>
            how <Text style={styles.Hook}>Hook</Text> works
          </Text>
          <Text style={styles.header}>Bottom navigation bar</Text>
          {/* home function */}
          <Divider style={{marginTop: 15, marginBottom: 15}} />
          <Image
            source={require('../assets/hookiconActive.png')}
            style={{height: 30, width: 30, left: '10%'}}
          />
          <Divider style={{marginTop: 15, marginBottom: 15}} />
          <Text style={styles.DescribeText}>
            Find new people{'\n'}Set your preferences
          </Text>

          {/* like function */}
          <Divider style={{marginTop: 15, marginBottom: 15}} />
          <Image
            source={require('../assets/heartActive.png')}
            style={{height: 30, width: 30, left: '28%'}}
          />
          <Divider style={{marginTop: 15, marginBottom: 15}} />

          <Text style={styles.DescribeText}>See who already liked you</Text>

          {/* search function */}
          <Divider style={{marginTop: 15, marginBottom: 15}} />
          <Image
            source={require('../assets/searchActive.png')}
            style={{height: 30, width: 30, left: '43%'}}
          />
          <Divider style={{marginTop: 15, marginBottom: 15}} />

          <Text style={styles.DescribeText}>
            Search for users{'\n'}See top pick users
          </Text>

          {/* chat function */}
          <Divider style={{marginTop: 15, marginBottom: 15}} />
          <Image
            source={require('../assets/chatActive.png')}
            style={{height: 30, width: 30, left: '64%'}}
          />
          <Divider style={{marginTop: 15, marginBottom: 15}} />

          <Text style={styles.DescribeText}>
            Chat with your hooks{'\n'}Do quiz
          </Text>

          {/* profile function */}
          <Divider style={{marginTop: 15, marginBottom: 15}} />
          <Image
            source={require('../assets/userActive.png')}
            style={{height: 30, width: 30, left: '81%'}}
          />
          <Divider style={{marginTop: 15, marginBottom: 15}} />

          <Text style={styles.DescribeText}>
            View your profile{'\n'}Change and add your profile info
            {'\n'}Upload pictures
          </Text>

          <Divider style={{marginTop: 40, marginBottom: 15}} />

          <Text style={styles.header}>On Main page</Text>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/InstructionsUse/swipeL.png')}
                style={{height: 80, width: 80}}
              ></Image>
              <Text style={{fontSize: 23}}>Dislike</Text>
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
              <Text style={{fontSize: 24}}>User details</Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/InstructionsUse/swipeR.png')}
                style={{height: 80, width: 80}}
              ></Image>
              <Text style={{fontSize: 22}}>Like</Text>
            </View>
          </View>
          <Divider style={{marginTop: 40, marginBottom: 15}} />

          <Text style={styles.header}>Some buttons</Text>

          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: '10%',
                alignItems: 'center',
              }}
            >
              <Button style={styles.Button}></Button>
              <Text style={styles.DescribeText2}>Reload 10 new users</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: '10%',
                alignItems: 'center',
              }}
            >
              <Button style={styles.Button}></Button>
              <Text style={styles.DescribeText2}>Like</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: '10%',
                alignItems: 'center',
              }}
            >
              <Button style={styles.Button}></Button>
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
              <Button style={styles.Button}></Button>
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
              <Button style={styles.Button}></Button>
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
              <Button style={styles.Button}></Button>
              <Text style={styles.DescribeText2}>
                Edit your profile{'\n'}Upload pictures
              </Text>
            </View>
          </View>
          <Divider style={{marginTop: 15, marginBottom: 30}} />
          <Button
            onPress={() => navigation.navigate('Home')}
            style={styles.ScrollUpButton}
          >
            Ok I got this!
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '5%',
    paddingBottom: '5%',
    // borderBottomColor: '#C4C4C4',
  },
  Hook: {
    color: '#EB6833',
  },
  DescribeText: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 40,
    marginLeft: 20,
  },
  DescribeText2: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 40,
    marginLeft: 20,
  },
  Button: {
    width: 50,
    height: 60,
    borderRadius: 100,
    backgroundColor: 'white',
    shadowColor: '0 4 4 rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.8,
    marginLeft: 20,
  },
  ScrollUpButton: {
    alignSelf: 'center',
    width: 200,
    height: 40,
    backgroundColor: 'rgba(130, 0, 143, 0.69)',
    borderRadius: 10,
    color: 'white',
    textAlign: 'center',
  },
  header: {
    color: '#EB6833',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: '5%',
  },
});

Instructions.propTypes = {
  navigation: PropTypes.object,
};

export default Instructions;
