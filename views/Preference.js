/* eslint-disable camelcase */
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useContext, useState, useCallback, useEffect} from 'react';
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
import {useUser} from '../hooks/ApiHooks';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import DropDownPicker from 'react-native-dropdown-picker';
import {locationArray, countryArray, religionArray} from '../utils/data';
import {MainContext} from '../contexts/MainContext';

const Preference = ({navigation}) => {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const {putUser} = useUser();
  const {user, token, loading, setLoading} = useContext(MainContext);
  const additionData = JSON.parse(user.full_name);

  // slider values
  if (additionData.age_range === 'none') {
    additionData.age_range = '18-40';
  }
  const stringAge = additionData.age_range.split('-');
  const [ageRange, setAgeRange] = useState([
    parseInt(stringAge[0]),
    parseInt(stringAge[1]),
  ]);
  if (additionData.preference_height === 'none') {
    additionData.preference_height = '150-200';
  }
  const stringHeight = additionData.preference_height.split('-');
  const [height, setHeight] = useState([
    parseInt(stringHeight[0]),
    parseInt(stringHeight[1]),
  ]);
  if (additionData.preference_distance === 'none') {
    additionData.preference_distance = 50;
  }
  const setSliderHeight = (height) => setHeight(height);
  const setSliderAge = (ageRange) => setAgeRange(ageRange);

  // Picker open states
  const [openGender, setOpenGender] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [openNationality, setOpenNationality] = useState(false);
  const [openReligion, setOpenReligion] = useState(false);
  const [openDrinking, setOpenDrinking] = useState(false);
  const [openSmoking, setOpenSmoking] = useState(false);
  const [openPet, setOpenPet] = useState(false);

  // Picker value states
  const [gender, setGender] = useState(additionData.interested);
  const [location, setLocation] = useState(additionData.preference_location);
  const [nationality, setNationality] = useState(
    additionData.preference_nationality
  );
  const [religion, setReligion] = useState(additionData.preference_religion);
  const [drinking, setDrinking] = useState(additionData.preference_drinking);
  const [smoking, setSmoking] = useState(additionData.preference_smoking);
  const [pet, setPet] = useState(additionData.preference_pet);

  // Picker items
  const [genderItem, setGenderItems] = useState([
    {label: 'Female', value: 'Female'},
    {label: 'Male', value: 'Male'},
    {label: 'Nonbinary', value: 'Nonbinary'},
  ]);
  const [locationItems, setLocationItems] = useState([]);
  const [nationalityItem, setNationalityItems] = useState([]);
  const [religionItem, setReligionItems] = useState([]);
  const [drinkingItem, setDrinkingItems] = useState([
    {label: 'Yassss', value: 'Yes'},
    {label: 'Nope', value: 'No'},
    {label: 'None', value: 'None'},
  ]);
  const [smokingItem, setSmokingItems] = useState([
    {label: 'Yes', value: 'Yes'},
    {label: 'Thats a nope', value: 'No'},
    {label: 'None', value: 'None'},
  ]);
  const [petItem, setPetItems] = useState([
    {label: 'Pet lover', value: 'Yes'},
    {label: 'Urg no pet', value: 'No'},
    {label: 'None', value: 'None'},
  ]);

  // make key value arrays for items
  const makeArrays = () => {
    const resultLocation = locationArray.map((label) => ({
      label: label,
      value: label,
    }));

    setLocationItems(resultLocation);

    const resultNationality = countryArray.map((label) => ({
      label: label,
      value: label,
    }));
    setNationalityItems(resultNationality);

    setReligionItems(
      religionArray.map((label) => ({
        label: label,
        value: label,
      }))
    );
  };

  useEffect(() => {
    makeArrays();
  }, []);

  // modify user's preferences
  const modifyPreferences = async () => {
    if (gender) additionData.interested = gender;
    else additionData.interested = 'none';

    if (height) {
      additionData.preference_height = `${height[0]}-${height[1]}`;
    } else {
      additionData.preference_height = 'none';
    }

    if (ageRange) {
      additionData.age_range = `${ageRange[0]}-${ageRange[1]}`;
    } else {
      additionData.age_range = 'none';
    }
    if (location) additionData.preference_location = location;
    if (nationality) additionData.preference_nationality = nationality;
    if (religion) additionData.preference_religion = religion;
    if (drinking) additionData.preference_drinking = drinking;
    if (smoking) additionData.preference_smoking = smoking;
    if (pet) additionData.preference_pet = pet;

    user.full_name = JSON.stringify(additionData);
    try {
      const userData = await putUser(user, token);
      if (userData) {
        Alert.alert('Success', userData.message);
        setLoading(!loading);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // check open for multiple pickers
  const onGenderOpen = useCallback(() => {
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenPet(false);
  }, []);

  const onLocationOpen = useCallback(() => {
    setOpenGender(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenPet(false);
  }, []);
  const onNationalityOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenReligion(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenPet(false);
  }, []);
  const onReligionOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenPet(false);
  }, []);
  const onDrinkingOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenSmoking(false);
    setOpenPet(false);
  }, []);
  const onSmokingOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenDrinking(false);
    setOpenPet(false);
  }, []);
  const onPetOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
  }, []);

  // scroll for slider
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
          <Button
            labelStyle={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            Cancel
          </Button>
          <Text style={styles.appName}>Preferences</Text>
          <Button labelStyle={styles.button} onPress={modifyPreferences}>
            Done
          </Button>
        </View>
        <Divider style={{marginTop: 5}} />
        <ScrollView>
          <Text style={styles.header}>Basic Preferences</Text>
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>I{"'"}m interested in</Text>
          <DropDownPicker
            zIndex={10}
            zIndexInverse={1}
            open={openGender}
            onOpen={onGenderOpen}
            value={gender}
            items={genderItem}
            setOpen={setOpenGender}
            setValue={setGender}
            setItems={setGenderItems}
            listMode="SCROLLVIEW"
            containerStyle={styles.picker}
            textStyle={styles.textPicker}
            selectedItemLabelStyle={{color: '#EB6833'}}
            labelStyle={{color: '#EB6833'}}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Preferred Location</Text>
          <DropDownPicker
            searchable={true}
            zIndex={9}
            zIndexInverse={2}
            open={openLocation}
            value={location}
            items={locationItems}
            setItems={setLocationItems}
            setOpen={setOpenLocation}
            setValue={setLocation}
            listMode="SCROLLVIEW"
            onOpen={onLocationOpen}
            containerStyle={styles.picker}
            textStyle={styles.textPicker}
            selectedItemLabelStyle={{color: '#EB6833'}}
            labelStyle={{color: '#EB6833'}}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.header}>Other Preferences</Text>
          <Divider style={{marginTop: 5}} />
          <Text style={styles.title}>Age range</Text>
          <View style={styles.slider}>
            <MultiSlider
              isMarkersSeparated={true}
              enableLabel={true}
              min={18}
              max={40}
              values={
                ageRange[0] && ageRange[1]
                  ? [ageRange[0], ageRange[1]]
                  : [18, 40]
              }
              sliderLength={280}
              onValuesChangeStart={disableScroll}
              onValuesChangeFinish={enableScroll}
              onValuesChange={setSliderAge}
              markerStyle={styles.marker}
              selectedStyle={{backgroundColor: '#FF707B'}}
            />
          </View>
          <Divider style={{marginTop: 5}} />

          <Text style={styles.title}>Nationality</Text>
          <DropDownPicker
            searchable={true}
            zIndex={8}
            zIndexInverse={3}
            open={openNationality}
            value={nationality}
            items={nationalityItem}
            setOpen={setOpenNationality}
            setValue={setNationality}
            setItems={setNationalityItems}
            onOpen={onNationalityOpen}
            listMode="SCROLLVIEW"
            containerStyle={styles.picker}
            textStyle={styles.textPicker}
            selectedItemLabelStyle={{color: '#EB6833'}}
            labelStyle={{color: '#EB6833'}}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />

          <Text style={styles.title}>Religion</Text>
          <DropDownPicker
            zIndex={7}
            zIndexInverse={100}
            open={openReligion}
            value={religion}
            items={religionItem}
            setOpen={setOpenReligion}
            setValue={setReligion}
            setItems={setReligionItems}
            onOpen={onReligionOpen}
            listMode="SCROLLVIEW"
            containerStyle={styles.picker}
            textStyle={styles.textPicker}
            selectedItemLabelStyle={{color: '#EB6833'}}
            labelStyle={{color: '#EB6833'}}
          />
          <Divider style={{marginTop: 5}} />

          <Text style={styles.title}>Height (cm)</Text>
          <View style={styles.slider}>
            <MultiSlider
              isMarkersSeparated={true}
              enableLabel={true}
              min={150}
              max={200}
              step={5}
              values={
                height[0] && height[1] ? [height[0], height[1]] : [150, 200]
              }
              sliderLength={280}
              onValuesChangeStart={disableScroll}
              onValuesChangeFinish={enableScroll}
              onValuesChange={setSliderHeight}
              markerStyle={styles.marker}
              selectedStyle={{backgroundColor: '#FF707B'}}
            />
          </View>
          <Divider style={{marginBottom: 5, marginTop: 5}} />

          <Text style={styles.title}>Drinking</Text>
          <DropDownPicker
            zIndex={5}
            zIndexInverse={6}
            containerStyle={styles.picker}
            open={openDrinking}
            value={drinking}
            items={drinkingItem}
            setOpen={setOpenDrinking}
            setValue={setDrinking}
            setItems={setDrinkingItems}
            onOpen={onDrinkingOpen}
            listMode="SCROLLVIEW"
            textStyle={styles.textPicker}
            selectedItemLabelStyle={{color: '#EB6833'}}
            labelStyle={{color: '#EB6833'}}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />

          <Text style={styles.title}>Smoking</Text>
          <DropDownPicker
            zIndex={4}
            zIndexInverse={7}
            containerStyle={styles.picker}
            open={openSmoking}
            value={smoking}
            items={smokingItem}
            setOpen={setOpenSmoking}
            setValue={setSmoking}
            setItems={setSmokingItems}
            onOpen={onSmokingOpen}
            listMode="SCROLLVIEW"
            textStyle={styles.textPicker}
            selectedItemLabelStyle={{color: '#EB6833'}}
            labelStyle={{color: '#EB6833'}}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />

          <Text style={styles.title}>Pet</Text>
          <DropDownPicker
            zIndex={3}
            zIndexInverse={8}
            open={openPet}
            value={pet}
            items={petItem}
            setOpen={setOpenPet}
            setValue={setPet}
            setItems={setPetItems}
            onOpen={onPetOpen}
            listMode="SCROLLVIEW"
            containerStyle={styles.picker}
            textStyle={styles.textPicker}
            selectedItemLabelStyle={{color: '#EB6833'}}
            labelStyle={{color: '#EB6833'}}
          />
          <View style={{marginBottom: 40}}></View>
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
    color: '#7C7878',
    marginLeft: 20,
    marginTop: '10%',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 20,
    marginTop: '5%',
  },
  picker: {
    height: 50,
    width: '90%',
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
  },
  textPicker: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  slider: {
    alignSelf: 'center',
    marginTop: 35,
  },
  marker: {
    backgroundColor: '#EB6833',
    borderColor: '#FCF2F2',
    height: 25,
    width: 25,
  },
});

Preference.propTypes = {
  navigation: PropTypes.object,
};
export default Preference;
