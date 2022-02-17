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
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) return;
      console.log('token', userToken);
      const userData = await getUserByToken(userToken);
      console.log('checkToken', userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
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
                  onPress={() => setFormToggle(!formToggle)}
                  selectedIndex={formToggle ? 0 : 1}
                  buttons={['Sign in', 'Register']}
                  containerStyle={styles.buttons}
                  buttonContainerStyle={styles.button}
                  buttonStyle={{borderRadius: 50}}
                  textStyle={styles.text}
                  selectedButtonStyle={{backgroundColor: 'white'}}
                  selectedTextStyle={{color: 'black'}}
                />
                {formToggle ? (
                  <Card containerStyle={{borderRadius: 5, marginTop: 25}}>
                    <LoginForm />
                  </Card>
                ) : (
                  <Card style={{borderRadius: 5, marginTop: 25}}>
                    <RegisterForm setFormToggle={setFormToggle} />
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
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1.5,
    elevation: 15,
  },
  button: {
    borderRadius: 50,
    borderWidth: 0,
    borderColor: '#DA535E',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
