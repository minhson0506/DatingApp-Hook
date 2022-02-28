import {SafeAreaView, Text, View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {PropTypes} from 'prop-types';
import GlobalStyles from '../utils/GlobalStyles';
import {CheckBox} from 'react-native-elements';
import {Button} from 'react-native-paper';

const Interests = ({navigation}) => {
  const [yoga, setYoga] = useState(false);
  const [pets, setPets] = useState(false);
  const [food, setFood] = useState(false);
  const [button, setButtonSelected] = useState(false);

  // const array = [yoga, pets, food];
  // let checkedInterests = '';
  const updateInterest = (interest) => {
    console.log('interests', interest);
  };
  return (
    <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
      <Text>Choose at least 3 interests</Text>
      <View>
        {/* <CheckBox
          checkedIcon={''}
          uncheckedIcon={''}
          textStyle={yoga ? styles.true : styles.false}
          containerStyle={yoga ? styles.boxTrue : styles.boxFalse}
          title="Yoga"
          checked={yoga}
          onPress={() => setYoga(!yoga)}
        ></CheckBox>
        <CheckBox
          checkedIcon={''}
          uncheckedIcon={''}
          textStyle={pets ? styles.true : styles.false}
          containerStyle={pets ? styles.boxTrue : styles.boxFalse}
          title="Pets"
          checked={pets}
          onPress={() => setPets(!pets)}
        ></CheckBox>
        <CheckBox
          checkedIcon={''}
          uncheckedIcon={''}
          title="Food"
          checked={food}
          textStyle={food ? styles.true : styles.false}
          containerStyle={food ? styles.boxTrue : styles.boxFalse}
          onPress={() => setFood(!food)}
        ></CheckBox> */}
      </View>
      <Button onPress={updateInterest}>Done</Button>
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
