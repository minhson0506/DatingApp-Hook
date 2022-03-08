/* eslint-disable camelcase */
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  View,
  Text,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {ButtonGroup, Card} from 'react-native-elements';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {LinearGradient} from 'expo-linear-gradient';

const Login = ({navigation}) => {
  const [formToggle, setFormToggle] = useState(true);
  const {setIsLoggedIn, setUser, setToken} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) return;
      // console.log('token', userToken);
      const userData = await getUserByToken(userToken);
      // console.log('checkToken', userData);
      setUser(userData);
      setToken(userToken);
      setIsLoggedIn(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <LinearGradient
        // Background Linear Gradient
        colors={['#FF707B', '#FF934E']}
        style={styles.background}
      >
        <TouchableOpacity
          style={{flex: 1}}
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : ''}
            style={styles.container}
            // fix keyboard avoid view
          >
            <ScrollView>
              <Text style={styles.appName}>hook</Text>
              <View style={styles.form}>
                <ButtonGroup
                  innerBorderStyle={{color: '#DA535E'}}
                  onPress={() => setFormToggle(!formToggle)}
                  selectedIndex={formToggle ? 0 : 1}
                  buttons={['Register', 'Sign in']}
                  containerStyle={styles.buttons}
                  buttonContainerStyle={styles.button}
                  buttonStyle={{borderRadius: 50}}
                  textStyle={styles.text}
                  selectedButtonStyle={{backgroundColor: 'white'}}
                  selectedTextStyle={{color: 'black'}}
                />
                {formToggle ? (
                  <Card containerStyle={{borderRadius: 5, marginTop: 25}}>
                    <RegisterForm />
                  </Card>
                ) : (
                  <Card style={{borderRadius: 5, marginTop: 25}}>
                    <LoginForm setFormToggle={setFormToggle} />
                  </Card>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  background: {
    flex: 1,
  },
  appName: {
    textAlign: 'center',
    fontSize: 50,
    marginTop: '20%',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 10,
    color: 'white',
  },
  form: {
    flex: 8,
    marginTop: '20%',
  },
  buttons: {
    width: '80%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 50,
    backgroundColor: '#DA535E',
    borderWidth: 1,
    borderColor: '#DA535E',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  button: {
    borderRadius: 50,
    borderColor: '#DA535E',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
  userIcon: {
    width: 20,
    height: 20,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
