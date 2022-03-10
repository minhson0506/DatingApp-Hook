/* eslint-disable camelcase */
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import React, {useContext, useState, useCallback, useEffect} from 'react';
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
import {Card, Input, Divider} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import {Video} from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useForm, Controller} from 'react-hook-form';
import {useFocusEffect} from '@react-navigation/native';
import {appId} from '../utils/variables';
import backIcon from '../assets/back.svg';
import LottieView from 'lottie-react-native';

const Upload = ({navigation}) => {
  const animation = React.createRef();

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const {update, setUpdate, token} = useContext(MainContext);

  const {postMedia, load} = useMedia();
  const {postTag} = useTag();

  const [image, setImage] = useState(
    'https://www.linkpicture.com/q/iPhone-8-2-1.png'
  );
  const [imageSelected, setImageSelected] = useState(false);
  const [type, setType] = useState('image');
  const [upload, setUpload] = useState(false);
  const [didMount, setDidMount] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      description: '',
    },
  });

  // pick image function
  const pickImage = async (id) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.5,
      });
      if (!result.cancelled) {
        setImage(result.uri);
        setImageSelected(true);
        setType(result.type);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', 'title');
    formData.append('description', data.description);
    const filename = image.split('/').pop();
    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    formData.append('file', {
      uri: image,
      name: filename,
      type: type + '/' + fileExtension,
    });
    try {
      const response = await postMedia(formData, token);
      const tagResponse = await postTag(
        {file_id: response.file_id, tag: appId},
        token
      );
      setUpload(!upload);
      setUpdate(update + 1);
      setTimeout(() => {
        tagResponse &&
          Alert.alert('Success', 'Uploaded successfully', [
            {
              text: 'OK',
            },
          ]);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    setImage('https://www.linkpicture.com/q/iPhone-8-2-1.png');
    setImageSelected(false);
    setValue('description', '');
    setType('image');
  };

  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [])
  );

  useEffect(() => {
    animation.current?.play(0, 520);
  }, [upload]);

  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  }, []);

  if (!didMount) {
    return null;
  }

  if (!fontsLoaded) {
    return <View />;
  } else {
    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'flex-end'}}
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={styles.container}
            // fix keyboard avoid view
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Button
                labelStyle={styles.button}
                onPress={() => navigation.navigate('Profile')}
                icon={backIcon}
                underlayColor="white"
              ></Button>
              <Text style={styles.appName}>Upload</Text>
              <Button disabled={true}></Button>
            </View>
            <Divider style={{marginBottom: 5, marginTop: 5}} />

            <ScrollView>
              <Text style={styles.header}>Upload your pictures or video</Text>
              <LottieView
                style={{width: '80%', alignSelf: 'center'}}
                ref={animation}
                source={require('../assets/animation/load2.json')}
                autoPlay={false}
                loop={false}
                resizeMode="cover"
              />
              <View style={styles.box}>
                <Card containerStyle={styles.card}>
                  {type === 'image' ? (
                    <Card.Image
                      source={{uri: image}}
                      style={styles.image}
                      onPress={pickImage}
                    ></Card.Image>
                  ) : (
                    <Video
                      source={{uri: image}}
                      style={styles.image}
                      useNativeControls={true}
                      resizeMode="cover"
                      onError={(err) => {
                        console.error('video', err);
                      }}
                    />
                  )}

                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        placeholder="Caption this"
                        style={{textAlign: 'center'}}
                        errorMessage={errors.description}
                      />
                    )}
                    name="description"
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Button onPress={reset}>Reset</Button>

                    <Button
                      disabled={!imageSelected}
                      loading={load}
                      onPress={handleSubmit(onSubmit)}
                    >
                      Upload
                    </Button>
                  </View>
                </Card>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginLeft: 10,
    marginTop: 20,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 10,
  },
  header: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#7C7878',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    width: '90%',
  },
  image: {
    width: '100%',
    height: 300,
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
