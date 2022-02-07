import React from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Avatar,
  Card,
  ListItem as RNEListItem,
  Text,
} from 'react-native-elements';
import {Image, ScrollView, StyleSheet, View} from 'react-native';

const ListItem = ({navigation, singleMedia}) => {
  return (
    // <RNEListItem
    //   containerStyle={{flexDirection: 'column'}}
    //   bottomDivider
    //   onPress={() => {
    //     navigation.navigate('Single', {file: singleMedia});
    //   }}
    // >
    //   <Text style={styles.name}>{singleMedia.title}</Text>
    //   {/* <View> */}
    //   <Avatar
    //     // style={styles.avatar}
    //     // style={{width: '100%', resizeMode: 'contain'}}
    //     //imageProps={{resizeMode: ''}}
    //     size="xlarge"
    //     source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
    //   ></Avatar>
    //   {/* </View> */}
    //   <Card containerStyle={{flexDirection: 'row'}}>
    //     <Text>Age</Text>
    //     <Text>Location</Text>
    //     <Text>Hobby</Text>
    //   </Card>
    // </RNEListItem>
    <Card>
      <Text style={styles.name}>{singleMedia.title}</Text>
      <Image
        style={styles.avatar}
        source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
      ></Image>
      <View style={{flexDirection: 'row'}}>
        <Text>Age</Text>
        <Text>Location</Text>
        <Text>Hobby</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  name: {
    // backgroundColor: 'blue',
    margin: 0,
  },
  avatar: {
    margin: 0,
    width: '100%',
    height: '75%',
    resizeMode: 'stretch',
  },
  card: {
    flex: 1,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
