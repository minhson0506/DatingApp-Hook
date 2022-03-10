import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Text, StyleSheet, View} from 'react-native';
import {useMedia, useUser} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import SadCat from '../assets/sad.svg';

const List = ({navigation, myFilesOnly = false}) => {
  const {user, loading, token} = useContext(MainContext);
  const {getUserById} = useUser();

  const {mediaArray} = useMedia(myFilesOnly);
  const [media, setMedia] = useState([]);

  const [didMount, setDidMount] = useState(false);

  const myAdditionData = JSON.parse(user.full_name);

  const filterData = async () => {
    if (!myFilesOnly) {
      // filter avatar to display
      let array = mediaArray.filter(
        (obj) => obj.title.toLowerCase() === 'avatar'
      );
      // filter current user out (so that login user cannot see himself in Home)
      array = array.filter((obj) => obj.user_id !== user.user_id);

      // fetch users data from media
      let userData = await Promise.all(
        array.map(async (obj) => {
          const userByFile = await getUserById(obj.user_id, token);
          const additionData = JSON.parse(userByFile.full_name);
          userByFile.full_name = additionData;
          return userByFile;
        })
      );

      // filter function by gender
      if (myAdditionData.interested.toLowerCase() !== 'nonbinary') {
        userData = userData.filter((obj) => {
          return obj.full_name.gender === myAdditionData.interested;
        });
      }

      // filter function by location
      if (userData.length > 5) {
        if (myAdditionData.preference_location.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return (
              obj.full_name.location === myAdditionData.preference_location
            );
          });
      }

      // filter function by drinking
      if (userData.length > 5) {
        if (myAdditionData.preference_drinking.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return (
              obj.full_name.drinking === myAdditionData.preference_drinking
            );
          });
      }

      // filter function by smoking
      if (userData.length > 5) {
        if (myAdditionData.preference_smoking.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return obj.full_name.smoking === myAdditionData.preference_smoking;
          });
      }

      // filter function by nationality
      if (userData.length > 5) {
        if (myAdditionData.preference_nationality.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return (
              obj.full_name.nationality ===
              myAdditionData.preference_nationality
            );
          });
      }

      // filter function by pet
      if (userData.length > 5) {
        if (myAdditionData.preference_pet.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return obj.full_name.pet === myAdditionData.preference_pet;
          });
      }

      // filter function by age
      if (userData.length > 5) {
        if (myAdditionData.age_range.toLowerCase() !== 'none') {
          const age = myAdditionData.age_range.split('-');
          userData = userData.filter((obj) => {
            return obj.full_name.age >= parseInt(age[0]);
          });
          userData = userData.filter((obj) => {
            return obj.full_name.age <= parseInt(age[1]);
          });
        }
      }

      // filter function by height
      if (userData.length > 5) {
        if (myAdditionData.preference_height.toLowerCase() !== 'none') {
          const height = myAdditionData.preference_height.split('-');
          userData = userData.filter((obj) => {
            return obj.full_name.height >= parseInt(height[0]);
          });
          userData = userData.filter((obj) => {
            return obj.full_name.height <= parseInt(height[1]);
          });
        }
      }

      // map user back to file media
      userData = userData.map((obj) => {
        return obj.user_id;
      });

      array = array.filter((obj) => {
        return userData.includes(obj.user_id);
      });

      // Random 5 person for display
      // shuffle array and display random 5 users
      if (array.length > 5) {
        array = array.sort(() => 0.5 - Math.random());
        array = array.slice(0, 5);
      }

      // set data to display
      setMedia(array);
    } else setMedia(mediaArray);
  };

  useEffect(() => {
    filterData();
  }, [mediaArray, loading]);

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, []);

  if (!didMount) {
    return null;
  }

  return (
    <>
      {media.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={styles.notFound}>No match found!</Text>
          <SadCat style={{alignSelf: 'center', marginTop: 20}}></SadCat>
        </View>
      ) : (
        <FlatList
          style={{alignSelf: 'center'}}
          data={media}
          keyExtractor={(item) => item.file_id.toString()}
          renderItem={({item}) => (
            <ListItem
              navigation={navigation}
              singleMedia={item}
              myFilesOnly={myFilesOnly}
            ></ListItem>
          )}
        ></FlatList>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  notFound: {
    alignSelf: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
});

List.propTypes = {
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
};

export default List;
