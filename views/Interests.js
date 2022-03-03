import {SafeAreaView, Text, View, StyleSheet, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {array, PropTypes} from 'prop-types';
import GlobalStyles from '../utils/GlobalStyles';
import {Button} from 'react-native-paper';
import {dataSource} from '../utils/data';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';

const Interests = ({navigation}) => {
  const {putUser, getUserByToken} = useUser();
  const {user, loading, setLoading, token} = useContext(MainContext);
  let additionData = JSON.parse(user.full_name);
  // let array = [];
  const [media, setMedia] = useState([]);
  const [arrayState, setArrayState] = useState(
    additionData.interests.split(',')
  );
  let result = [];

  const arrayLoading = async () => {
    const user = await getUserByToken(token);
    additionData = JSON.parse(user.full_name);
    const arrayInteres = additionData.interests.split(',');
    let number = 0;
    // for (let i = 1; i < dataSource.length; i++) {
    result = dataSource.map((value) => {
      const obj = {
        id: number++,
        name: value,
        selected: arrayInteres.includes(value) ? true : false,
      };
      return obj;
    });
    setArrayState(result);
    setMedia(result);
    // console.log('datasouce', result);
  };

  const onPressHandler = async (id) => {
    console.log('id', id);
    const array = media;
    // console.log('array', array);
    // if (array[id].selected === true) {
    //   array[id].selected = false;
    // } else {
    //   array[id].selected = true;
    // }
    array[id].selected = !array[id].selected;
    // console.log('array of data', array);
    // TODO put data to users
    let interests = media.filter((obj) => {
      return obj.selected;
    });
    interests = interests
      .map((obj) => {
        return obj.name;
      })
      .toString();
    additionData.interests = interests;
    user.full_name = JSON.stringify(additionData);
    console.log('user data new', user);
    delete user.user_id;
    try {
      await putUser(user, token);
      console.log('modify ok');
      setMedia(array);
      setArrayState(arrayState);
      // setLoading(!loading);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    arrayLoading();
  }, [arrayState]);

  return (
    <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
      <Text style={{alignSelf: 'center', margin: 20}}>
        Choose at least 3 interests
      </Text>
      <FlatList
        contentContainerStyle={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}
        // numColumns={3}
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
      />
      {/* <Button onPress={updateInterest}>Done</Button> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  true: {
    color: 'red',
    marginLeft: 0,
  },
  false: {
    color: 'black',
  },
  boxTrue: {
    width: 100,
    borderColor: 'red',
  },
  boxFalse: {
    borderColor: 'black',
  },
});

Interests.propTypes = {
  navigation: PropTypes.object,
};

export default Interests;
