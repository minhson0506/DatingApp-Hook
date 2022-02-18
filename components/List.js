import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation}) => {
  const {myFilesOnly} = useContext(MainContext);
  console.log('bool myFilesOnly', myFilesOnly);
  const {mediaArray} = useMedia(myFilesOnly);
  if (myFilesOnly) {
    mediaArray.filter((obj) => obj.title.toLowerCase() !== 'avatar');
  }
  // console.log('media array in ListItem', mediaArray);

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
