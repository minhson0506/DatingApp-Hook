import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import List from '../components/List';
import PropTypes from 'prop-types';
import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('token', userToken);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <>
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <List navigation={navigation}></List>
      </SafeAreaView>
      <StatusBar style="auto"></StatusBar>
    </>
  );
};

Home.propTypes = {navigation: PropTypes.object};

export default Home;
