/* eslint-disable camelcase */
import React, {useEffect, useContext, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
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
import {Menu, MenuItem} from 'react-native-material-menu';

const Home = ({navigation}) => {
  const {loading, setLoading, user} = useContext(MainContext);
  console.log('user', user);
  // menu state & functions
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

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
            <Menu
              style={styles.menuBox}
              visible={visible}
              anchor={
                <MenuIcon
                  style={styles.menu}
                  onPress={() => {
                    showMenu();
                  }}
                ></MenuIcon>
              }
              onRequestClose={hideMenu}
            >
              <MenuItem
                pressColor={'#FDC592'}
                textStyle={styles.textMenu}
                onPress={() => {
                  hideMenu();
                  navigation.navigate('Modify user');
                }}
              >
                Account
              </MenuItem>
              <MenuItem
                pressColor={'#FDC592'}
                textStyle={styles.textMenu}
                onPress={() => {
                  hideMenu();
                  navigation.navigate('Instructions');
                }}
              >
                How Hook works
              </MenuItem>
            </Menu>
            <Text style={styles.appName}>hook</Text>
            <TouchableHighlight
              underlayColor="white"
              onPress={() => {
                navigation.navigate('Preferences');
              }}
            >
              <FilterIcon style={styles.filter}></FilterIcon>
            </TouchableHighlight>
          </View>
          <List navigation={navigation}></List>
          <FAB
            style={styles.fab}
            medium
            icon={ReloadIcon}
            onPress={() => setLoading(!loading)}
          />
        </SafeAreaView>
        <StatusBar style="auto"></StatusBar>
      </>
    );
  }
};

const styles = StyleSheet.create({
  menu: {
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  menuBox: {
    marginTop: 45,
    marginLeft: 10,
    borderRadius: 5,
  },
  textMenu: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
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
    right: 10,
    bottom: 5,
    backgroundColor: 'white',
    paddingBottom: 3,
  },
});

Home.propTypes = {navigation: PropTypes.object};

export default Home;
