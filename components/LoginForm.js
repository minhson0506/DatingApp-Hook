/* eslint-disable camelcase */
import React, {useContext} from 'react';
import {Button, Input, Text} from 'react-native-elements';
import {View, StyleSheet, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {MainContext} from '../contexts/MainContext';
import {useLogin} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinearGradient} from 'expo-linear-gradient';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import UserIcon from '../assets/userIcon.svg';
import PasswordIcon from '../assets/password.svg';

const LoginForm = () => {
  const {setIsLoggedIn, setUser, setToken, setInstruction} =
    useContext(MainContext);

  const {postLogin} = useLogin();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function isJson(str) {
    if (str === null) return false;
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const onSubmit = async (data) => {
    try {
      const userData = await postLogin(data);
      if (isJson(userData.user.full_name)) {
        const additionData = JSON.parse(userData.user.full_name);
        // eslint-disable-next-line no-prototype-builtins
        if (additionData.hasOwnProperty('deleted_hook')) {
          if (additionData.deleted_hook === 0) {
            await AsyncStorage.setItem('userToken', userData.token);
            setInstruction(false);
            setToken(userData.token);
            setUser(userData.user);
            setIsLoggedIn(true);
          } else {
            Alert.alert('Deleted', 'User has already been deleted!');
          }
        } else {
          Alert.alert('Fail', 'User does not exit in Hook');
        }
      } else {
        Alert.alert('Fail', 'User does not exit in Hook');
      }
    } catch (error) {
      Alert.alert('Fail', 'Wrong username or password!');
      console.error(error);
    }
  };

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="username"
              leftIcon={<UserIcon />}
              leftIconContainerStyle={styles.userIcon}
            />
          )}
          name="username"
        />
        {errors.username && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="password"
              leftIcon={<PasswordIcon />}
              leftIconContainerStyle={styles.userIcon}
            />
          )}
          name="password"
        />
        {errors.password && <Text>This is required.</Text>}

        <Button
          title="SIGN IN"
          onPress={handleSubmit(onSubmit)}
          buttonStyle={styles.button}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ['#FF707B', '#FF934E'],
            start: {x: 0, y: 0},
            end: {x: 1, y: 0},
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    width: '60%',
    alignSelf: 'center',
    marginTop: 10,
    fontFamily: 'Poppins_700Bold',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    elevation: 4,
  },
  userIcon: {
    paddingRight: 10,
  },
});

export default LoginForm;
