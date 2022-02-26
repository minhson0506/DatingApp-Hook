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
import {Divider, Input} from 'react-native-elements';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  locationArray,
  countryArray,
  religionArray,
  educationArray,
} from '../utils/data';
import {MainContext} from '../contexts/MainContext';

const EditProfile = ({navigation}) => {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const {putUser} = useUser();
  const {user} = useContext(MainContext);
  const additionData = JSON.parse(user.full_name);

  // input values
  const [name, setName] = useState(additionData.fullname);
  const [work, setWork] = useState(additionData.work);
  const [job, setJob] = useState(additionData.job);
  const [school, setSchool] = useState(additionData.school);

  // slider values
  if (additionData.age === 'none') {
    additionData.age = 0;
  }
  if (additionData.height === 'none') {
    additionData.height = 0;
  }
  const [age, setAge] = useState(additionData.age);
  const [height, setHeight] = useState(additionData.height);
  const setSliderHeight = (height) => setHeight(height[0]);
  const setSliderAge = (distance) => setAge(age[0]);

  // Picker open states
  const [openGender, setOpenGender] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [openNationality, setOpenNationality] = useState(false);
  const [openEducation, setOpenEducation] = useState(additionData.false);
  const [openReligion, setOpenReligion] = useState(false);
  const [openFamily, setOpenFamily] = useState(false);
  const [openDrinking, setOpenDrinking] = useState(false);
  const [openSmoking, setOpenSmoking] = useState(false);
  const [openPet, setOpenPet] = useState(false);

  // Picker value states
  const [gender, setGender] = useState(additionData.gender);
  const [location, setLocation] = useState(additionData.location);
  const [nationality, setNationality] = useState(additionData.nationality);
  const [education, setEducation] = useState(additionData.education_level);
  const [religion, setReligion] = useState(additionData.religious_beliefs);
  const [family, setFamily] = useState(additionData.family_plan);
  const [drinking, setDrinking] = useState(additionData.drinking);
  const [smoking, setSmoking] = useState(additionData.smoking);
  const [pet, setPet] = useState(additionData.pet);

  // Picker items
  const [genderItem, setGenderItems] = useState([
    {label: 'Female', value: 'female'},
    {label: 'Male', value: 'male'},
    {label: 'Nonbinary', value: 'nonbinary'},
  ]);
  const [locationItems, setLocationItems] = useState([]);
  const [nationalityItem, setNationalityItems] = useState([]);
  const [educationItem, setEducationItems] = useState([]);
  const [religionItem, setReligionItems] = useState([]);
  const [familyItem, setFamilyItems] = useState([
    {label: 'I want kid', value: 'Want kid'},
    {label: 'I dont want kid', value: 'Dont want kid'},
  ]);
  const [drinkingItem, setDrinkingItems] = useState([
    {label: 'Yassss', value: 'Yes'},
    {label: 'Nope', value: 'No'},
  ]);
  const [smokingItem, setSmokingItems] = useState([
    {label: 'Yes', value: 'Yes'},
    {label: 'Thats a nope', value: 'No'},
  ]);
  const [petItem, setPetItems] = useState([
    {label: 'Pet lover', value: 'Yes'},
    {label: 'Urg no pet', value: 'No'},
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
    setEducationItems(
      educationArray.map((label) => ({
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
      additionData.height = height;
    } else {
      additionData.height = 'none';
    }

    if (age) {
      additionData.age = age;
    } else {
      additionData.age = 'none';
    }

    if (name) additionData.fullname = name;
    if (work) additionData.work = work;
    if (job) additionData.job = job;
    if (school) additionData.school = school;
    if (family) additionData.family_plan = family;
    if (nationality) additionData.preference_nationality = nationality;
    if (religion) additionData.religious_beliefs = religion;
    if (drinking) additionData.drinking = drinking;
    if (smoking) additionData.smoking = smoking;
    if (pet) additionData.pet = pet;
    if (education) additionData.education_level = education;

    user.full_name = JSON.stringify(additionData);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await putUser(user, userToken);
      if (userData) {
        Alert.alert('Success', userData.message);
        // update info after navigate
        navigation.navigate('Profile');
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
    setOpenFamily(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenPet(false);
    setOpenEducation(false);
  }, []);

  const onLocationOpen = useCallback(() => {
    setOpenGender(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenFamily(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenPet(false);
    setOpenEducation(false);
  }, []);
  const onNationalityOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenReligion(false);
    setOpenFamily(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenPet(false);
    setOpenEducation(false);
  }, []);
  const onReligionOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenFamily(false);
    setOpenNationality(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenPet(false);
    setOpenEducation(false);
  }, []);
  const onFamilyOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenPet(false);
    setOpenEducation(false);
  }, []);
  const onDrinkingOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenFamily(false);
    setOpenSmoking(false);
    setOpenPet(false);
    setOpenEducation(false);
  }, []);
  const onSmokingOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenDrinking(false);
    setOpenFamily(false);
    setOpenPet(false);
    setOpenEducation(false);
  }, []);
  const onPetOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenFamily(false);
    setOpenEducation(false);
  }, []);
  const onEducationOpen = useCallback(() => {
    setOpenGender(false);
    setOpenLocation(false);
    setOpenNationality(false);
    setOpenReligion(false);
    setOpenDrinking(false);
    setOpenSmoking(false);
    setOpenFamily(false);
    setOpenPet(false);
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
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
          <Text style={styles.appName}>
            {additionData.fullname ? additionData.fullname : 'hook'}
          </Text>
          <Button
            labelStyle={styles.button}
            onPress={() => {
              navigation.navigate('Profile');
              modifyPreferences();
            }}
          >
            Done
          </Button>
        </View>
        <Divider style={{marginBottom: 5, marginTop: 5}} />
        <ScrollView>
          <Text style={styles.header}>My Vital</Text>
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Name</Text>
          <Input
            value={name}
            autoCapitalize="none"
            placeholder="Work"
            onChangeText={(value) => setName(value)}
            containerStyle={{marginLeft: 10}}
            inputStyle={styles.inputStyle}
            inputContainerStyle={{borderBottomWidth: 0}}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />

          <Text style={styles.title}>Gender</Text>
          <DropDownPicker
            zIndex={6000}
            zIndexInverse={1000}
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
          <Text style={styles.title}>Age</Text>
          <View style={styles.slider}>
            <MultiSlider
              enableLabel={true}
              isMarkersSeparated={false}
              values={age ? [age] : [0]}
              max={40}
              onValuesChange={setSliderAge}
              onValuesChangeStart={disableScroll}
              onValuesChangeFinish={enableScroll}
              markerStyle={styles.marker}
              selectedStyle={{backgroundColor: '#FF707B'}}
            />
          </View>
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Height (cm)</Text>
          <View style={styles.slider}>
            <MultiSlider
              enableLabel={true}
              isMarkersSeparated={false}
              values={height ? [height] : [0]}
              max={200}
              onValuesChange={setSliderHeight}
              onValuesChangeStart={disableScroll}
              onValuesChangeFinish={enableScroll}
              markerStyle={styles.marker}
              selectedStyle={{backgroundColor: '#FF707B'}}
            />
          </View>
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Location</Text>
          <DropDownPicker
            searchable={true}
            zIndex={5000}
            zIndexInverse={2000}
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
          <Text style={styles.title}>Nationality</Text>
          <DropDownPicker
            searchable={true}
            zIndex={4000}
            zIndexInverse={3000}
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
          <Text style={styles.title}>Family Plan</Text>
          <DropDownPicker
            zIndex={2000}
            zIndexInverse={5000}
            containerStyle={styles.picker}
            open={openFamily}
            value={family}
            items={familyItem}
            setOpen={setOpenFamily}
            setValue={setFamily}
            setItems={setFamilyItems}
            onOpen={onFamilyOpen}
            listMode="SCROLLVIEW"
            textStyle={styles.textPicker}
            selectedItemLabelStyle={{color: '#EB6833'}}
            labelStyle={{color: '#EB6833'}}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Pet</Text>
          <DropDownPicker
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
          <Text style={styles.header}>My virture</Text>

          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Work</Text>
          <Input
            value={work}
            autoCapitalize="none"
            placeholder="Work"
            onChangeText={(value) => setWork(value)}
            containerStyle={{marginLeft: 10}}
            inputStyle={styles.inputStyle}
            inputContainerStyle={{borderBottomWidth: 0}}
          />
          <Text style={styles.title}>Job Title</Text>
          <Input
            value={job}
            autoCapitalize="none"
            placeholder="Job"
            onChangeText={(value) => setJob(value)}
            containerStyle={{marginLeft: 10}}
            inputStyle={styles.inputStyle}
            inputContainerStyle={{borderBottomWidth: 0}}
          />

          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Educational Level</Text>
          <DropDownPicker
            containerStyle={styles.picker}
            open={openEducation}
            value={education}
            items={educationItem}
            setOpen={setOpenEducation}
            setValue={setEducation}
            setItems={setEducationItems}
            onOpen={onEducationOpen}
            listMode="SCROLLVIEW"
            textStyle={styles.textPicker}
            selectedItemLabelStyle={{color: '#EB6833'}}
            labelStyle={{color: '#EB6833'}}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>School</Text>
          <Input
            value={school}
            autoCapitalize="none"
            placeholder="School"
            onChangeText={(value) => setSchool(value)}
            containerStyle={{marginLeft: 10}}
            inputStyle={styles.inputStyle}
            inputContainerStyle={{borderBottomWidth: 0}}
          />
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.title}>Religion</Text>
          <DropDownPicker
            zIndex={3000}
            zIndexInverse={4000}
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
          <Divider style={{marginBottom: 5, marginTop: 5}} />
          <Text style={styles.header}>My Vices</Text>
          <Divider style={{marginBottom: 5, marginTop: 5}} />

          <Text style={styles.title}>Drinking</Text>
          <DropDownPicker
            zIndex={1000}
            zIndexInverse={6000}
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

          <View style={{marginBottom: 40}}></View>
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
    width: '90%',
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
    borderColor: '#EB6833',
  },
  textPicker: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  slider: {
    marginLeft: 35,
    marginTop: 35,
  },
  marker: {
    backgroundColor: '#EB6833',
    borderColor: '#FCF2F2',
    height: 20,
    width: 20,
  },
  inputStyle: {
    fontFamily: 'Poppins_500Medium',
    color: '#EB6833',
  },
});

EditProfile.propTypes = {
  navigation: PropTypes.object,
};
export default EditProfile;
