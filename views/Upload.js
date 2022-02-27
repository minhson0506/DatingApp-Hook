/* eslint-disable camelcase */
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useContext, useState, useCallback} from 'react';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';
import {Button} from 'react-native-paper';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {Card, Input, Divider} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {Video} from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useForm, Controller} from 'react-hook-form';
import {useFocusEffect} from '@react-navigation/native';
import {appId} from '../utils/variables';

const Upload = ({navigation}) => {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });
  const {
    control: control1,
    handleSubmit: handleSubmit1,
    formState: {errors: errors1},
    setValue: setValue1,
  } = useForm({
    defaultValues: {
      // title1: 'Title',
      description1: '',
    },
  });
  const {
    control: control2,
    handleSubmit: handleSubmit2,
    formState: {errors: errors2},
    setValue: setValue2,
  } = useForm({
    defaultValues: {
      // title2: 'Title',
      description2: '',
    },
  });
  const {
    control: control3,
    handleSubmit: handleSubmit3,
    formState: {errors: errors3},
    setValue: setValue3,
  } = useForm({
    defaultValues: {
      // title3: 'Title',
      description3: '',
    },
  });

  const [image1, setImage1] = useState(
    'https://www.linkpicture.com/q/iPhone-8-2-1.png'
  );
  const [image2, setImage2] = useState(
    'https://www.linkpicture.com/q/iPhone-8-2-1.png'
  );
  const [image3, setImage3] = useState(
    'https://www.linkpicture.com/q/iPhone-8-2-1.png'
  );
  const [image1Selected, setImage1Selected] = useState(false);
  const [image2Selected, setImage2Selected] = useState(false);
  const [image3Selected, setImage3Selected] = useState(false);

  const [type1, setType1] = useState('image');
  const [type2, setType2] = useState('image');
  const [type3, setType3] = useState('image');

  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  // pick image function
  const pickImage = async (id) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.cancelled) {
      switch (id) {
        case 1:
          setImage1(result.uri);
          setImage1Selected(true);
          setType1(result.type);
          break;
        case 2:
          setImage2(result.uri);
          setImage2Selected(true);
          setType2(result.type);
          break;
        default:
          setImage3(result.uri);
          setImage3Selected(true);
          setType3(result.type);
          break;
      }
    }
  };

  const onSubmit1 = async (data) => {
    const formData = new FormData();
    formData.append('title', 'title');
    formData.append('description', data.description1);
    const filename1 = image1.split('/').pop();
    let fileExtension1 = filename1.split('.').pop();
    fileExtension1 = fileExtension1 === 'jpg' ? 'jpeg' : fileExtension1;
    formData.append('file', {
      uri: image1,
      name: filename1,
      type: type1 + '/' + fileExtension1,
    });
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await postMedia(formData, userToken);
      const tagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        userToken
      );
      tagResponse &&
        Alert.alert('Upload', 'Uploaded successfully', [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Edit Profile');
            },
          },
        ]);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit2 = async (data) => {
    const formData = new FormData();
    formData.append('title', 'title');
    formData.append('description', data.description2);
    const filename2 = image2.split('/').pop();
    let fileExtension2 = filename2.split('.').pop();
    fileExtension2 = fileExtension2 === 'jpg' ? 'jpeg' : fileExtension2;
    formData.append('file', {
      uri: image2,
      name: filename2,
      type: type2 + '/' + fileExtension2,
    });
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await postMedia(formData, userToken);
      const tagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        userToken
      );
      tagResponse &&
        Alert.alert('Upload', 'Uploaded successfully', [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Edit Profile');
            },
          },
        ]);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit3 = async (data) => {
    const formData = new FormData();
    formData.append('title', 'title');
    formData.append('description', data.description3);
    const filename3 = image3.split('/').pop();
    let fileExtension3 = filename3.split('.').pop();
    fileExtension3 = fileExtension3 === 'jpg' ? 'jpeg' : fileExtension3;
    formData.append('file', {
      uri: image3,
      name: filename3,
      type: type3 + '/' + fileExtension3,
    });
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await postMedia(formData, userToken);
      const tagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        userToken
      );
      tagResponse &&
        Alert.alert('Upload', 'Uploaded successfully', [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Edit Profile');
            },
          },
        ]);
    } catch (error) {
      console.error(error);
    }
  };

  const reset = (id) => {
    switch (id) {
      case 1:
        setImage1('https://www.linkpicture.com/q/iPhone-8-2-1.png');
        setImage1Selected(false);
        setValue1('description1', '');
        setType1('image');
        break;
      case 2:
        setImage2('https://www.linkpicture.com/q/iPhone-8-2-1.png');
        setImage2Selected(false);
        setValue2('description2', '');
        setType2('image');
        break;
      default:
        setImage3('https://www.linkpicture.com/q/iPhone-8-2-1.png');
        setImage3Selected(false);
        setValue3('description3', '');
        setType3('image');
        break;
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [])
  );

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            labelStyle={styles.button}
            onPress={() => navigation.navigate('Profile')}
          >
            Cancel
          </Button>
          <Text style={styles.appName}>Upload</Text>
          <Button
            labelStyle={styles.button}
            onPress={() => navigation.navigate('Profile')}
          >
            Done
          </Button>
        </View>
        <Divider style={{marginBottom: 5, marginTop: 5}} />

        <ScrollView>
          <Text style={styles.header}>Upload your pictures or video</Text>
          <View style={styles.box}>
            <Card containerStyle={styles.card}>
              {type1 === 'image' ? (
                <Card.Image
                  source={{uri: image1}}
                  style={styles.image}
                  onPress={() => {
                    pickImage(1);
                  }}
                ></Card.Image>
              ) : (
                <Video
                  source={{uri: image1}}
                  style={styles.image}
                  useNativeControls={true}
                  resizeMode="cover"
                  onError={(err) => {
                    console.error('video', err);
                  }}
                />
              )}
              <Controller
                control={control1}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    placeholder="Caption this"
                    style={{textAlign: 'center'}}
                    errorMessage={errors1.description1}
                  />
                )}
                name="description1"
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}
              >
                <Button
                  onPress={() => {
                    reset(1);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  // style={{marginLRight: 20}}
                  disabled={!image1Selected}
                  loading={loading}
                  onPress={handleSubmit1(onSubmit1)}
                >
                  Upload
                </Button>
              </View>
            </Card>
            <Card containerStyle={styles.card}>
              {type2 === 'image' ? (
                <Card.Image
                  source={{uri: image2}}
                  style={styles.image}
                  onPress={() => {
                    pickImage(2);
                  }}
                ></Card.Image>
              ) : (
                <Video
                  source={{uri: image2}}
                  style={styles.image}
                  useNativeControls={true}
                  resizeMode="cover"
                  onError={(err) => {
                    console.error('video', err);
                  }}
                />
              )}
              <Controller
                control={control2}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    placeholder="Caption this"
                    style={{textAlign: 'center'}}
                    errorMessage={errors2.description2}
                  />
                )}
                name="description2"
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}
              >
                <Button
                  onPress={() => {
                    reset(2);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  // style={{marginLRight: 20}}
                  disabled={!image2Selected}
                  loading={loading}
                  onPress={handleSubmit2(onSubmit2)}
                >
                  Upload
                </Button>
              </View>
            </Card>
            <Card containerStyle={styles.card}>
              {type3 === 'image' ? (
                <Card.Image
                  source={{uri: image3}}
                  style={styles.image}
                  onPress={() => {
                    pickImage(3);
                  }}
                ></Card.Image>
              ) : (
                <Video
                  source={{uri: image3}}
                  style={styles.image}
                  useNativeControls={true}
                  resizeMode="cover"
                  onError={(err) => {
                    console.error('video', err);
                  }}
                />
              )}
              <Controller
                control={control3}
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    placeholder="Caption this"
                    style={{textAlign: 'center'}}
                    errorMessage={errors3.description3}
                  />
                )}
                name="description3"
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}
              >
                <Button
                  onPress={() => {
                    reset(3);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  // style={{marginLRight: 20}}
                  disabled={!image3Selected}
                  loading={loading}
                  onPress={handleSubmit3(onSubmit3)}
                >
                  Upload
                </Button>
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    textTransform: 'lowercase',
    color: '#EB6833',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  header: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#7C7878',
    textAlign: 'center',
    marginTop: 20,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
  },
  image: {
    width: 300,
    height: 250,
    marginTop: 10,
    marginBottom: 10,

    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 20,
    marginTop: '5%',
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};
export default Upload;
