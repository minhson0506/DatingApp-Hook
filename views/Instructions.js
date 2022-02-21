import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
// import {SafeAreaView} from 'react-native';
// import GlobalStyles from '../utils/GlobalStyles';
import {Image} from 'react-native-elements';
import {Button} from 'react-native-paper';

const Instructions = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{}}>
        {/* title */}
        <View
          style={{
            borderBottomColor: '#EDE0DA',
            // marginBottom: '4%',
            borderBottomWidth: 1,
          }}
        >
          <Text style={styles.Title}>
            How <Text style={styles.Hook}>hook</Text> works
          </Text>
          <Text style={[styles.Title, styles.Hook]}>Bottom navigation bar</Text>
        </View>

        {/* home function */}
        <View style={styles.IconsBar}>
          <Image
            source={require('../assets/hookiconActive.png')}
            style={{height: 30, width: 30, left: '10%'}}
          />
        </View>
        <View style={styles.DescribeBar}>
          <Text style={styles.DescribeText}>
            Find new people{'\n'}Set your preferences
          </Text>
        </View>

        {/* like function */}
        <View style={styles.IconsBar}>
          <Image
            source={require('../assets/heartActive.png')}
            style={{height: 30, width: 30, left: '28%'}}
          />
        </View>
        <View style={styles.DescribeBar}>
          <Text style={styles.DescribeText}>See who already liked you</Text>
        </View>

        {/* search function */}
        <View style={styles.IconsBar}>
          <Image
            source={require('../assets/searchActive.png')}
            style={{height: 30, width: 30, left: '43%'}}
          />
        </View>
        <View style={styles.DescribeBar}>
          <Text style={styles.DescribeText}>
            Search for users{'\n'}See top pick users
          </Text>
        </View>

        {/* chat function */}
        <View style={styles.IconsBar}>
          <Image
            source={require('../assets/chatActive.png')}
            style={{height: 30, width: 30, left: '64%'}}
          />
        </View>
        <View style={styles.DescribeBar}>
          <Text style={styles.DescribeText}>
            Chat with your hooks{'\n'}Do quiz
          </Text>
        </View>

        {/* profile function */}
        <View style={styles.IconsBar}>
          <Image
            source={require('../assets/userActive.png')}
            style={{height: 30, width: 30, left: '81%'}}
          />
        </View>
        <View style={styles.DescribeBar}>
          <Text style={styles.DescribeText}>
            View your profile{'\n'}Change and add your profile info
            {'\n'}Upload pictures
          </Text>
        </View>

        <View
          style={{
            height: '5%',
            borderBottomColor: '#EDE0DA',
            borderBottomWidth: 1,
          }}
        >
          <Text style={[styles.Title, styles.Hook]}>On Main page</Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                left: '25%',
                top: 30,
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
                left: '32%',
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
                left: '40%',
                flexDirection: 'column',
                alignItems: 'center',
                top: 30,
              }}
            >
              <Image
                source={require('../assets/InstructionsUse/swipeR.png')}
                style={{height: 80, width: 80}}
              ></Image>
              <Text style={{fontSize: 22}}>Like</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            height: '10%',
            borderBottomColor: '#EDE0DA',
            borderBottomWidth: 1,
          }}
        >
          <Text style={[styles.Title, styles.Hook]}>Some buttons</Text>

          <View style={{flexDirection: 'column', left: 20}}>
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
        </View>

        <View>
          <Button
            onPress={() => navigation.navigate('Home')}
            style={styles.ScrollUpButton}
          >
            Ok I got this!
          </Button>
        </View>
      </ScrollView>
    </View>
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
    left: '5%',
    lineHeight: 40,
  },
  IconsBar: {
    // 10
    height: '5%',
    borderBottomColor: '#EDE0DA',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  DescribeBar: {
    // 20
    height: '15%',
    borderBottomColor: '#EDE0DA',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  DescribeText2: {
    fontSize: 22,
    fontWeight: '500',
    left: 25,
    lineHeight: 40,
  },
  Button: {
    width: 50,
    height: 60,
    borderRadius: 100,
    backgroundColor: 'white',
    shadowColor: '0 4 4 rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.8,
  },
  ScrollUpButton: {
    justifyContent: 'center',
    width: 300,
    height: 50,
    left: 30,
    backgroundColor: 'rgba(130, 0, 143, 0.69)',
    borderRadius: 10,
    color: 'white',
    top: 50,
    textAlign: 'center',
  },
});

Instructions.propTypes = {
  navigation: PropTypes.object,
};

export default Instructions;
