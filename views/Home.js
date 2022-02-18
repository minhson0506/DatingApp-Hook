import React, {useEffect} from 'react';
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
        <View style={{flexDirection: 'row'}}>
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
};

const styles = StyleSheet.create({
  menu: {
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#EB6833',
    marginLeft: '25%',
  },
  filter: {
    marginLeft: '25%',
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
