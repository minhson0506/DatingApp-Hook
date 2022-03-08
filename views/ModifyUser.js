/* eslint-disable camelcase */
import React, {useContext} from 'react';
import {
  Alert,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {Input, Divider} from 'react-native-elements';
import {Button} from 'react-native-paper';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PropTypes} from 'prop-types';
import GlobalStyles from '../utils/GlobalStyles';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';

const ModifyUser = ({navigation}) => {
  const {checkUsername, putUser} = useUser();
  const {user, setUser, setIsLoggedIn, token} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: user.username,
      user_id: user.user_id,
      password: '',
      confirmPassword: '',
      email: user.email,
      full_name: user.full_name,
    },
    mode: 'onBlur',
  });

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
    } catch (err) {
      console.error(err);
    }
    setIsLoggedIn(false);
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      delete data.confirmPassword;
      if (data.password === '') {
        delete data.password;
      }
      const userData = await putUser(data, token);
      if (userData) {
        Alert.alert('Success', userData.message);
        delete data.password;
        setUser(data);
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return <View />;
  } else {
    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            labelStyle={styles.button}
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
          <Text style={styles.appName}>Account</Text>
          <Button
            labelStyle={styles.button}
            onPress={() => {
              navigation.navigate('Profile');
            }}
          >
            Done
          </Button>
        </View>
        <Divider style={{marginBottom: 5, marginTop: 5}} />
        <ScrollView>
          <Text style={styles.header}>Username & email</Text>
          <Divider style={{marginBottom: 5, marginTop: 10}} />
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
              minLength: {
                value: 3,
                message: 'Username has to be at least 3 characters.',
              },
              validate: async (value) => {
                try {
                  const available = await checkUsername(value);
                  if (available || user.username === value) {
                    return true;
                  } else {
                    return 'Username is already taken.';
                  }
                } catch (error) {
                  throw new Error(error.message);
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="username"
                errorMessage={errors.username && errors.username.message}
                containerStyle={{marginLeft: 10, marginTop: 10}}
                inputStyle={styles.inputStyle}
                inputContainerStyle={{borderBottomWidth: 0}}
              />
            )}
            name="username"
          />
          <Divider style={{marginBottom: 5}} />

          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
              pattern: {
                value: /\S+@\S+\.\S+$/,
                message: 'Has to be valid email.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="email"
                errorMessage={errors.email && errors.email.message}
                containerStyle={{marginLeft: 10, marginTop: 10}}
                inputStyle={styles.inputStyle}
                inputContainerStyle={{borderBottomWidth: 0}}
              />
            )}
            name="email"
          />
          <Divider style={{marginBottom: '15%'}} />
          <Text style={styles.header}>Change Password</Text>
          <Divider style={{marginBottom: 5, marginTop: 10}} />

          <Controller
            control={control}
            rules={{
              minLength: {
                value: 5,
                message: 'Password has to be at least 5 characters.',
              },
              /*
          pattern: {
            value: /(?=.*[\p{Lu}])(?=.*[0-9]).{8,}/u,
            message: 'Min 8, Uppercase, Number',
          },
          */
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                secureTextEntry={true}
                placeholder="password"
                errorMessage={errors.password && errors.password.message}
                containerStyle={{marginLeft: 10, marginTop: 10}}
                inputStyle={styles.inputStyle}
                inputContainerStyle={{borderBottomWidth: 0}}
              />
            )}
            name="password"
          />
          <Divider style={{marginBottom: 5}} />

          <Controller
            control={control}
            rules={{
              validate: (value) => {
                const {password} = getValues();
                if (value === password) {
                  return true;
                } else {
                  return 'Passwords do not match.';
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                secureTextEntry={true}
                placeholder="confirm password"
                errorMessage={
                  errors.confirmPassword && errors.confirmPassword.message
                }
                containerStyle={{marginLeft: 10, marginTop: 10}}
                inputStyle={styles.inputStyle}
                inputContainerStyle={{borderBottomWidth: 0}}
              />
            )}
            name="confirmPassword"
          />
          <Divider style={{marginBottom: '10%'}} />

          <Button
            style={styles.ScrollUpButton}
            labelStyle={{
              fontSize: 15,
            }}
            onPress={handleSubmit(onSubmit)}
          >
            Save
          </Button>

          <Divider style={{marginBottom: 5, marginTop: '15%'}} />
          <Button
            labelStyle={{
              color: 'black',
              fontSize: 15,
            }}
            onPress={logOut}
          >
            Log out
          </Button>
          <Divider style={{marginBottom: 5, marginTop: 10}} />
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    textTransform: 'lowercase',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  header: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 20,
    marginTop: 20,
  },
  inputStyle: {
    fontFamily: 'Poppins_500Medium',
    color: '#EB6833',
  },
  ScrollUpButton: {
    alignSelf: 'center',
    width: 100,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#82008F',
    justifyContent: 'center',
  },
});

ModifyUser.propTypes = {
  navigation: PropTypes.object,
};

export default ModifyUser;
