import React from 'react';
import {FlatList, View} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const List = ({navigation}) => {
  const {mediaArray} = useMedia();

  return (
    // <View style={{flex: 1}}>
    <FlatList
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item}></ListItem>
      )}
    ></FlatList>
    // </View>
  );
};

List.propTypes = {navigation: PropTypes.object.isRequired};

export default List;
