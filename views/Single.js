import React from 'react';
import {TouchableHighlight, StyleSheet, View, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Card, ListItem, Text} from 'react-native-elements';
import BackIcon from '../assets/back.svg';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';

const Single = ({route, navigation}) => {
  const {file} = route.params;
  return (
    <>
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <View style={{flexDirection: 'row'}}>
          <TouchableHighlight
            underlayColor="white"
            onPress={() => {
              navigation.navigate('Home');
            }}
          >
            <BackIcon style={styles.menu}></BackIcon>
          </TouchableHighlight>

          <Text style={styles.appName}>hook</Text>
        </View>
        <View style={styles.avatar}>
          <Avatar
            source={{uri: uploadsUrl + file.filename}}
            containerStyle={styles.image}
            avatarStyle={{borderRadius: 100}}
          />
        </View>
        <Card>
          <Card.Title h4>{file.title}</Card.Title>
          <Card.Title>{file.time_added}</Card.Title>
          <Card.Divider />

          <Card.Divider />
          <Text style={styles.description}>{file.description}</Text>
          <ListItem>
            <Avatar source={{uri: 'http://placekitten.com/180'}} />
            <Text>Ownername</Text>
          </ListItem>
        </Card>
      </SafeAreaView>
      <StatusBar style="auto"></StatusBar>
    </>
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
  menu: {
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#EB6833',
    marginLeft: '25%',
  },
  filter: {
    marginLeft: '25%',
    marginTop: 15,
    marginBottom: 20,
  },
  image: {
    width: '90%',
    height: '90%',
    alignSelf: 'center',
    top: 7,
  },
  avatar: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderWidth: 1.5,
    borderRadius: 100,
    borderColor: '#EB6432',
  },
});

Single.propTypes = {route: PropTypes.object, navigation: PropTypes.object};

export default Single;
