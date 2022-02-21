/* eslint-disable camelcase */
import {Text} from 'react-native';
import React, {useContext, useState} from 'react';
import GlobalStyles from '../utils/GlobalStyles';
import {StyleSheet, View, SafeAreaView, Alert, Picker} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from 'react-native-paper';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {Divider} from 'react-native-elements';
import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';

const Preference = ({navigation}) => {
  const {user, setUser} = useContext(MainContext);
  const {putUser} = useUser();
  const [selectedValue, setSelectedValue] = useState('java');
  // const {
  //   control,
  //   handleSubmit,
  //   formState: {errors},
  //   getValues,
  // } = useForm({
  //   defaultValues: {
  //     username: user.username,
  //     password: '',
  //     confirmPassword: '',
  //     email: user.email,
  //     full_name: user.full_name,
  //   },
  //   mode: 'onBlur',
  // });

  // const onSubmit = async (data) => {
  //   try {
  //     const userToken = await AsyncStorage.getItem('userToken');
  //     const userData = await putUser(data, userToken);
  //     if (userData) {
  //       Alert.alert('Success', userData.message);
  //       setUser(data);
  //       navigation.navigate('Profile');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
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
          <Button labelStyle={styles.button}>Cancel</Button>
          <Text style={styles.appName}>Preferences</Text>
          <Button labelStyle={styles.button}>Done</Button>
        </View>
        <Divider style={{marginBottom: 5, marginTop: '5%'}} />
        <Picker
          selectedValue={selectedValue}
          style={{height: 50, width: 150}}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    textTransform: 'lowercase',
    color: '#EB6833',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
});

Preference.propTypes = {
  navigation: PropTypes.object,
};
export default Preference;
