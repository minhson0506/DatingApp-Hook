import React from 'react';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import List from '../components/List';
import PropTypes from 'prop-types';
import {StatusBar} from 'expo-status-bar';

const Home = ({navigation}) => {
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
