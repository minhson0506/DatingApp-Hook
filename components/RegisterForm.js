/* eslint-disable max-len */
import React from 'react';
import {Button, Input} from 'react-native-elements';
import {Alert, View, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {LinearGradient} from 'expo-linear-gradient';
import FullnameIcon from '../assets/fullname.svg';
import UserIcon from '../assets/userIcon.svg';
import PasswordIcon from '../assets/password.svg';
import PropTypes from 'prop-types';

const RegisterForm = ({setFormToggle, navigation}) => {
  const {postUser, checkUsername} = useUser();
  const {
    getValues,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      delete data.password_again;
      // TODO: randomize email to post user
      const userData = await postUser(data);
      console.log('register onSubmit', userData);
      if (userData) {
        setFormToggle(true);
        Alert.alert('Success', 'User created successfully! Please login!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      {/* <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          pattern: {
            value:
              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: 'Please enter a valid email!',
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
          />
        )}
        name="email"
      /> */}
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters',
          },
          validate: async (value) => {
            try {
              const available = await checkUsername(value);
              console.log('available', available);
              if (available) {
                return true;
              } else {
                return 'Username is already taken!';
              }
            } catch (error) {
              throw Error(error.message);
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
            leftIcon={<UserIcon />}
            leftIconContainerStyle={styles.userIcon}
          />
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          minLength: {
            value: 3,
            message: 'Full name must be at least 3 characters',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            placeholder="fullname"
            errorMessage={errors.full_name && errors.full_name.message}
            leftIcon={<FullnameIcon />}
            leftIconContainerStyle={styles.userIcon}
          />
        )}
        name="full_name"
      />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 5,
            message: 'Password must be at least 5 characters',
          },
          pattern: {
            value: /(?=.*[0-9])(?=.*[A-Z])/,
            message: 'One number and one capital letter required!',
          },
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
            leftIcon={<PasswordIcon />}
            leftIconContainerStyle={styles.userIcon}
          />
        )}
        name="password"
      />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          validate: async () => {
            const password1 = getValues('password');
            const password2 = getValues('password_again');
            if (password1 === password2) {
              return true;
            } else {
              return 'Password is not match!';
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
            placeholder="enter password again"
            errorMessage={
              errors.password_again && errors.password_again.message
            }
            leftIcon={<PasswordIcon />}
            leftIconContainerStyle={styles.userIcon}
          />
        )}
        name="password_again"
      />

      <Button
        title="REGISTER"
        onPress={handleSubmit(onSubmit)}
        buttonStyle={styles.button}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#FF707B', '#FF934E'],
          start: {x: 0, y: 0},
          end: {x: 1, y: 0},
        }}
      />

      {/* <Button
        title="Info"
        onPress={() => {
          navigation.navigate('Instructions');
        }}
      ></Button> */}
    </View>
  );
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

RegisterForm.propTypes = {
  setFormToggle: PropTypes.func,
  navigation: PropTypes.object,
};

export default RegisterForm;
