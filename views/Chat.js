import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import React from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';

const Chat = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <View>
          <Text style={styles.Title}>hook</Text>
        </View>
      </SafeAreaView>
      <StatusBar style="auto"></StatusBar>
    </>
  );
};

const styles = StyleSheet.create({
  Title: {
    color: '#EB6833',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

Chat.propTypes = {
  navigation: PropTypes.object,
};

export default Chat;
