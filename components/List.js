import React, {useContext, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useMedia, useUser} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation, myFilesOnly = false}) => {
  const [didMount, setDidMount] = useState(false);
  const {user, loading} = useContext(MainContext);
  const {getUserById} = useUser();
  const {token} = useContext(MainContext);
  // console.log('token', token);
  // const {userArray} = useUser(token);
  // console.log('users', userArray);
  const {mediaArray} = useMedia(myFilesOnly);
  const [media, setMedia] = useState([]);
  // console.log('media begin', mediaArray);
  // const [mediaArray, setMediaArray] = useMedia(myFilesOnly);
  // const [media, setMedia] = useState([]);
  const myAdditionData = JSON.parse(user.full_name);
  // console.log('inter of user', myAdditionData.interested);
  // const numberDisplay = 5;

  const filterData = async () => {
    // console.log('my file only', myFilesOnly);
    // setMedia(mediaArray);
    // console.log('interested', myAdditionData.interested);
    if (!myFilesOnly) {
      // console.log('media Data original', mediaArray);

      // filter avatar media
      let array = mediaArray.filter(
        (obj) => obj.title.toLowerCase() === 'avatar'
      );

      // console.log('media data after filter avatar', array);
      // filter current user
      array = array.filter((obj) => obj.user_id !== user.user_id);
      // console.log(
      //   'media array after filter avatar and user before state',
      //   array
      // );

      // switch to user
      let userData = await Promise.all(
        array.map(async (obj) => {
          const userByFile = await getUserById(obj.user_id, token);
          const additionData = JSON.parse(userByFile.full_name);
          userByFile.full_name = additionData;
          return userByFile;
        })
      );

      // console.log('user data start', userData);

      // console.log('current user', myAdditionData);
      // filter by gender
      if (myAdditionData.gender !== 'nonbinary') {
        userData = userData.filter((obj) => {
          // console.log('gender', obj.full_name.gender);
          return obj.full_name.gender === myAdditionData.interested;
        });
      }
      // console.log('length after filter gender', userData.length);

      if (userData.length > 5) {
        if (myAdditionData.preference_location.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return (
              obj.full_name.location === myAdditionData.preference_location
            );
          });
      }
      // console.log('length after filter location', userData.length);

      if (userData.length > 5) {
        if (myAdditionData.preference_drinking.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return obj.full_name.driking === myAdditionData.preference_drinking;
          });
      }
      // console.log('length after filter drinking', userData.length);

      if (userData.length > 5) {
        if (myAdditionData.preference_smoking.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return obj.full_name.smoking === myAdditionData.preference_smoking;
          });
      }
      // console.log('length after filter smoking', userData.length);

      if (userData.length > 5) {
        if (myAdditionData.preference_nationality.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return (
              obj.full_name.nationality ===
              myAdditionData.preference_nationality
            );
          });
      }
      // console.log('length after filter nationality', userData.length);

      if (userData.length > 5) {
        if (myAdditionData.preference_pet.toLowerCase() !== 'none')
          userData = userData.filter((obj) => {
            return obj.full_name.pet === myAdditionData.preference_pet;
          });
      }
      // console.log('length after filter pet', userData.length);

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
      // console.log('length after filter age', userData.length);

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
      // console.log('length after filter height', userData.length);

      // console.log('user data after filter', userData);

      // setMedia(array);
      // console.log('user array modified', userData);

      // switch user to file
      userData = userData.map((obj) => {
        return obj.user_id;
      });

      // console.log('user_id', userData);
      // console.log('media array after filter user ', media);
      array = array.filter((obj) => {
        return userData.includes(obj.user_id);
      });

      // //Random 5 person for display
      // console.log('length', media.length);
      // shuffle array and display random 5 users
      array = array.sort(() => 0.5 - Math.random());
      if (array.length > 5) array = array.slice(0, 5);

      // set data to display
      setMedia(array);
      // console.log('media after filter', media);
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
  );
};

List.propTypes = {
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
};

export default List;
