import React, {useContext, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useMedia, useUser} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation, myFilesOnly = false}) => {
  const {user} = useContext(MainContext);
  const {getUserById} = useUser();
  const {token} = useContext(MainContext);
  const {mediaArray} = useMedia(myFilesOnly);
  const [media, setMedia] = useState(mediaArray);
  // const [mediaArray, setMediaArray] = useMedia(myFilesOnly);
  // const [media, setMedia] = useState([]);
  const myAdditionData = JSON.parse(user.full_name);
  // console.log('inter of user', myAdditionData.interested);
  const numberDisplay = 5;

  const filterData = async () => {
    console.log('my file only', myFilesOnly);
    if (!myFilesOnly) {
      setMedia(
        mediaArray.filter(function (obj) {
          return obj.title.toLowerCase() === 'avatar';
        })
      );

      // await setMedia(
      //   mediaArray.filter((obj) => obj.title.toLowerCase() === 'avatar')
      // );
      // //   setMedia(mediaArray);
      // // console.log('data', mediaArray);
      // //   // filter data not belong in current user
      // //   mediaArray = media.filter((obj) => obj.user_id !== user.user_id);
      // //   setMedia(mediaArray);
      // //   // //TODO: match by preference
      // //   // //filter by preference
      // //   // //filter by sex
      // await setMedia(
      //   mediaArray.filter(async function (obj) {
      //     try {
      //       const userByFile = await getUserById(obj.user_id, token);
      //       const additionData = JSON.parse(userByFile.full_name);
      //       if (myAdditionData.interested.includes('male')) {
      //         // console.log('gender of match', additionData.gender);
      //         return additionData.gender === 'male';
      //       } else if (myAdditionData.interested.includes('female')) {
      //         return additionData.gender === 'female';
      //       }
      //     } catch (err) {
      //       console.error(err);
      //     }
      //   })
      // );
      //   setMedia(mediaArray);

      //   // // // console.log('media array after filter', data);
      //   // // //Random 5 person for display
      //   const length = mediaArray.length;
      //   const randomArray = [
      //     Math.floor(Math.random() * length),
      //     Math.floor(Math.random() * length),
      //     Math.floor(Math.random() * length),
      //     Math.floor(Math.random() * length),
      //     Math.floor(Math.random() * length),
      //   ];

      //   for (let i = 0; i < numberDisplay, i++; ) {
      //     for (let j = 0; j < i, j++; ) {
      //       while (randomArray[j] === randomArray[i])
      //         randomArray[i] = Math.floor(Math.random() * length);
      //     }
      //   }

      //   if (mediaArray.length >= 5) {
      //     const mediaData = [
      //       mediaArray[randomArray[0]],
      //       mediaArray[randomArray[1]],
      //       mediaArray[randomArray[2]],
      //       mediaArray[randomArray[3]],
      //       mediaArray[randomArray[4]],
      //     ];
      //     console.log('mediaData', mediaData);

      //     mediaArray = media.filter(
      //       (obj) =>
      //         obj === mediaData[0] ||
      //         obj === mediaData[1] ||
      //         obj === mediaData[2] ||
      //         obj === mediaData[3] ||
      //         obj === mediaData[4]
      //     );
      //     setMedia(mediaArray);
      //     // if (media) setMedia(media);
      //     // console.log('mediaData', media);
      //   }
      //   setMedia(mediaArray);
    }
    // setMedia(mediaArray);
    // console.log('media array in ListItem', media);
  };

  useEffect(() => {
    filterData();
  }, [mediaArray]);

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
