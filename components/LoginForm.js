<<<<<<< HEAD
<<<<<<< HEAD
import {useContext} from 'react';
=======
import React, {useContext} from 'react';
>>>>>>> cb2dd71 (draft 1 styling for login and signup page)
=======
import {useContext} from 'react';
>>>>>>> c898839 (more completed version of login-signup page)
import {Button, Input, Text} from 'react-native-elements';
import {View, StyleSheet} from 'react-native';
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
<<<<<<< HEAD
<<<<<<< HEAD
import UserIcon from '../assets/userIcon.svg';
import PasswordIcon from '../assets/password.svg';
=======
>>>>>>> cb2dd71 (draft 1 styling for login and signup page)
=======
import UserIcon from '../assets/userIcon.svg';
import PasswordIcon from '../assets/password.svg';
>>>>>>> c898839 (more completed version of login-signup page)

const LoginForm = () => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
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

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const userData = await postLogin(data);
      await AsyncStorage.setItem('userToken', userData.token);
      setUser(userData.user);
      setIsLoggedIn(true);
    } catch (error) {
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
<<<<<<< HEAD
<<<<<<< HEAD
              leftIcon={<UserIcon />}
              leftIconContainerStyle={styles.userIcon}
=======
>>>>>>> cb2dd71 (draft 1 styling for login and signup page)
=======
              leftIcon={<UserIcon />}
              leftIconContainerStyle={styles.userIcon}
>>>>>>> c898839 (more completed version of login-signup page)
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
<<<<<<< HEAD
<<<<<<< HEAD
              leftIcon={<PasswordIcon />}
              leftIconContainerStyle={styles.userIcon}
=======
>>>>>>> cb2dd71 (draft 1 styling for login and signup page)
=======
              leftIcon={<PasswordIcon />}
              leftIconContainerStyle={styles.userIcon}
>>>>>>> c898839 (more completed version of login-signup page)
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
<<<<<<< HEAD
<<<<<<< HEAD
  userIcon: {
    paddingRight: 10,
  },
=======
>>>>>>> cb2dd71 (draft 1 styling for login and signup page)
=======
  userIcon: {
    paddingRight: 10,
  },
>>>>>>> c898839 (more completed version of login-signup page)
});

export default LoginForm;
