/* eslint-disable camelcase */
import React, {useContext, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import List from '../components/List';
import PropTypes from 'prop-types';
import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuIcon from '../assets/menu.svg';
import FilterIcon from '../assets/filter.svg';
import {FAB} from 'react-native-paper';
import ReloadIcon from '../assets/reload.svg';
import {useFonts, Poppins_700Bold} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {MainContext} from '../contexts/MainContext';

const Home = ({navigation}) => {
  const {setToken} = useContext(MainContext);
  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // console.log('token', userToken);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MenuIcon style={styles.menu}></MenuIcon>
            <Text style={styles.appName}>hook</Text>
            <FilterIcon style={styles.filter}></FilterIcon>
          </View>
          <List navigation={navigation}></List>
          <FAB
            style={styles.fab}
            small
            icon={ReloadIcon}
            onPress={() => console.log('Pressed')}
          />
        </SafeAreaView>
        <StatusBar style="auto"></StatusBar>
      </>
    );
  }
};

const styles = StyleSheet.create({
  menu: {
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  appName: {
    fontSize: 40,
    color: '#EB6833',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 5,
  },
  filter: {
    marginRight: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 10,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    paddingBottom: 3,
  },
});

Home.propTypes = {navigation: PropTypes.object};

export default Home;
