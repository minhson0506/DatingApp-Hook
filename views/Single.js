import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Card, ListItem, Text} from 'react-native-elements';

const Single = ({route}) => {
  const {file} = route.params;
  return (
    <Card>
      <Card.Title h4>{file.title}</Card.Title>
      <Card.Title>{file.time_added}</Card.Title>
      <Card.Divider />
      <Card.Image
        source={{uri: uploadsUrl + file.filename}}
        style={styles.image}
        PlaceholderContent={<ActivityIndicator></ActivityIndicator>}
      />
      <Card.Divider />
      <Text style={styles.description}>{file.description}</Text>
      <ListItem>
        <Avatar source={{uri: 'http://placekitten.com/180'}} />
        <Text>Ownername</Text>
      </ListItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

Single.propTypes = {route: PropTypes.object};

export default Single;
