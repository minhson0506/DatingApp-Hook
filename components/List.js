import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation, myFilesOnly = false}) => {
  const {user} = useContext(MainContext);
  let {mediaArray} = useMedia(myFilesOnly);

  const numberDisplay = 5;

  if (!myFilesOnly) {
    mediaArray = mediaArray.filter(
      (obj) => obj.title.toLowerCase() === 'avatar'
    );

    //filter data not belong in current user
    mediaArray = mediaArray.filter((obj) => obj.user_id !== user.user_id);

    //TODO: match by preference

    //Filter 5 person for display
    const length = mediaArray.length;
    let randomArray = [
      Math.floor(Math.random() * length),
      Math.floor(Math.random() * length),
      Math.floor(Math.random() * length),
      Math.floor(Math.random() * length),
      Math.floor(Math.random() * length),
    ];

    for (let i = 0; i < numberDisplay, i++; ) {
      for (let j = 0; j < i, j++; ) {
        while (randomArray[j] === randomArray[i])
          randomArray[i] = Math.floor(Math.random() * length);
      }
    }

    let mediaData = [
      mediaArray[randomArray[0]],
      mediaArray[randomArray[1]],
      mediaArray[randomArray[2]],
      mediaArray[randomArray[3]],
      mediaArray[randomArray[4]],
    ];

    mediaArray = mediaArray.filter(
      (obj) =>
        obj === mediaData[0] ||
        obj === mediaData[1] ||
        obj === mediaData[2] ||
        obj === mediaData[3] ||
        obj === mediaData[4]
    );

    console.log('mediaData', mediaData);
  }
  console.log('media array in ListItem', mediaArray);

  return (
    <FlatList
      style={{alignSelf: 'center'}}
      data={mediaArray}
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
