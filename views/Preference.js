/* eslint-disable camelcase */
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import GlobalStyles from '../utils/GlobalStyles';
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
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import DropDownPicker from 'react-native-dropdown-picker';

const Preference = ({navigation}) => {
  const {user, setUser} = useContext(MainContext);
  const {putUser} = useUser();
  const [ageRage, setAgeRange] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: user.username,
      password: '',
      confirmPassword: '',
      email: user.email,
      full_name: user.full_name,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await putUser(data, userToken);
      if (userData) {
        Alert.alert('Success', userData.message);
        setUser(data);
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const enableScroll = () => ({scrollEnabled: true});
  const disableScroll = () => ({scrollEnabled: false});

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
        <Divider style={{marginBottom: 5, marginTop: 10}} />
        <ScrollView>
          <Text style={styles.header}>Basic Preferences</Text>
          <Divider style={{marginBottom: 5, marginTop: 10}} />
          <Text style={styles.title}>I{"'"}m interested in</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Preferred Location</Text>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
              minLength: {
                value: 3,
                message: 'Location has to be at least 3 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="None"
                errorMessage={errors.location && errors.location.message}
              />
            )}
            name="location"
          />
          <Divider style={{marginBottom: 10, marginTop: 5}} />
          <Text style={styles.header}>Other Preferences</Text>
          <Divider style={{marginBottom: 10, marginTop: 5}} />
          <Text style={styles.title}>Age range</Text>
          <MultiSlider
            isMarkersSeparated={true}
            customMarkerLeft={(e) => {
              return (
                <View>
                  <Text>{e.currentValue}</Text>
                </View>
              );
            }}
            customMarkerRight={(e1) => {
              return (
                <View>
                  <Text>{e1.currentValue}</Text>
                </View>
              );
            }}
            min={18}
            max={40}
            values={[18, 40]}
            sliderLength={280}
            onValuesChangeStart={disableScroll}
            onValuesChangeFinish={enableScroll}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Maximum distance</Text>
          <MultiSlider
            isMarkersSeparated={false}
            values={[100]}
            onValuesChangeStart={disableScroll}
            onValuesChangeFinish={enableScroll}
          />
          <Text style={styles.title}>Nationality</Text>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
              minLength: {
                value: 3,
                message: 'Nationality has to be at least 3 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="None"
                errorMessage={errors.nationality && errors.nationality.message}
              />
            )}
            name="nationality"
          />
          <Text style={styles.title}>Religion</Text>

          <Text style={styles.title}>Height</Text>
          <MultiSlider
            isMarkersSeparated={true}
            customMarkerLeft={(e) => {
              return (
                <View>
                  <Text>{e.currentValue}</Text>
                </View>
              );
            }}
            customMarkerRight={(e1) => {
              return (
                <View>
                  <Text>{e1.currentValue}</Text>
                </View>
              );
            }}
            min={18}
            max={40}
            values={[18, 40]}
            sliderLength={280}
            onValuesChangeStart={disableScroll}
            onValuesChangeFinish={enableScroll}
          />
          <Text style={styles.title}>Children</Text>

          <Text style={styles.title}>Family Plan</Text>

          <Text style={styles.title}>Drinking</Text>

          <Text style={styles.title}>Smoking</Text>
        </ScrollView>
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
  header: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#7C7878',
    marginLeft: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 20,
    marginTop: '5%',
  },
  picker: {
    height: 50,
    width: 140,
    marginBottom: 200,
    marginLeft: 20,
    marginTop: 10,
  },
  // inputIOS: {
  //   fontSize: 16,
  //   paddingVertical: 12,
  //   paddingHorizontal: 10,
  //   borderWidth: 1,
  //   borderColor: 'gray',
  //   borderRadius: 4,
  //   color: 'black',
  //   paddingRight: 30, // to ensure the text is never behind the icon
  // },
  textPicker: {
    backgroundColor: '#FF707B',
    borderRadius: 10,
    height: 50,
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
  },
});

Preference.propTypes = {
  navigation: PropTypes.object,
};
export default Preference;
