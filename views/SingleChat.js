import {View, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SingleChat = ({route, navigation}) => {
  const {item} = route.params;
  return (
    <>
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        ></View>
      </SafeAreaView>
    </>
  );
};

SingleChat.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SingleChat;
