import React, {useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';
import LottieView from 'lottie-react-native';
import {View, StyleSheet} from 'react-native';

const App = () => {
  const [loaded, setLoaded] = useState(false);

  if (loaded == false) {
    return (
      <>
        <View style={styles.splash}>
          <LottieView
            source={require('./assets/animation/splash.json')}
            autoPlay
            loop={false}
            style={{flex: 1}}
            resizeMode="cover"
            speed={1.5}
            onAnimationFinish={() => {
              console.log('animation finished');
              setLoaded(true);
            }}
          />
        </View>
        <StatusBar style="auto" />
      </>
    );
  } else {
    return (
      <>
        <MainProvider>
          <Navigator></Navigator>
        </MainProvider>
        <StatusBar style="auto" />
      </>
    );
  }
};

const styles = StyleSheet.create({
  splash: {
    flex: 2,
    alignItems: 'center',
    margin: 0,
  },
});

export default App;
