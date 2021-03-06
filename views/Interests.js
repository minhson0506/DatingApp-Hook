/* eslint-disable camelcase */
import {
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  View,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';
import GlobalStyles from '../utils/GlobalStyles';
import {Button} from 'react-native-paper';
import {hobbiesArray} from '../utils/data';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';

const Interests = ({navigation}) => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  const {user, token, loading, setLoading} = useContext(MainContext);

  const {putUser, getUserByToken} = useUser();

  const [media, setMedia] = useState([]);
  const [didMount, setDidMount] = useState(false);

  let result = [];

  // get string data of user (in full_name field)
  let additionData = JSON.parse(user.full_name);

  // fetch user data everytime user choose new hobby
  const arrayLoading = async () => {
    const user = await getUserByToken(token);
    additionData = JSON.parse(user.full_name);
    let arrayInterest = additionData.interests.split(' ').join('').split(',');
    arrayInterest = arrayInterest.map((obj) => obj.toLowerCase());
    let number = 0;
    result = hobbiesArray.map((value) => {
      const obj = {
        id: number++,
        name: value,
        selected: arrayInterest.includes(value.toLowerCase()) ? true : false,
      };
      return obj;
    });
    setMedia(result);
  };

  // put user right away everytime user choose new hobby
  const onPressHandler = async (id) => {
    const array = media;
    array[id].selected = !array[id].selected;
    let interests = media.filter((obj) => {
      return obj.selected;
    });
    interests = interests
      .map((obj) => {
        return obj.name.toLowerCase();
      })
      .toString();
    additionData.interests = interests;
    user.full_name = JSON.stringify(additionData);
    try {
      await putUser(user, token);
      setMedia(array);
      setLoading(!loading);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    arrayLoading();
  }, [loading]);

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, []);

  if (!didMount) {
    return null;
  }

  if (!fontsLoaded) {
    return <View />;
  } else {
    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <FlatList
          scrollEnabled={true}
          scrollToOverflowEnabled={true}
          ListHeaderComponent={
            <Text style={styles.header}>Choose at least 3 interests</Text>
          }
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: '5%',
          }}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          data={media}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <Button
              mode="outlined"
              color={item.selected === true ? '#B6000B' : '#979797'}
              style={
                item.selected === true
                  ? {
                      margin: 5,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: '#B6000B',
                    }
                  : {
                      margin: 5,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: '#979797',
                    }
              }
              onPress={() => {
                onPressHandler(item.id);
              }}
            >
              {item.name}
              {item.selected}
            </Button>
          )}
          ListFooterComponent={
            <Button
              style={styles.button}
              onPress={() => {
                Alert.alert('Success', 'Update profile succesfully');
                navigation.navigate('Profile');
              }}
            >
              Done
            </Button>
          }
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#EB6833',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#82008F',
    width: '30%',
    alignSelf: 'center',
    borderRadius: 10,
  },
});

Interests.propTypes = {
  navigation: PropTypes.object,
};

export default Interests;
