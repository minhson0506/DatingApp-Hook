/* eslint-disable camelcase */
import {View, Text, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {PropTypes} from 'prop-types';
import {useMedia, useFavourite, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem} from 'react-native-elements';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import {Searchbar, Button} from 'react-native-paper';
import MenuIcon from '../assets/menu.svg';
import GlobalStyles from '../utils/GlobalStyles';
import {Menu, MenuItem} from 'react-native-material-menu';
import LottieView from 'lottie-react-native';
import {useFocusEffect} from '@react-navigation/native';

const Search = ({navigation}) => {
  const animation = React.createRef();

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
  });
  // menu state & functions
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const [text, setText] = useState();
  const {mediaArray} = useMedia(false);
  const [media, setMedia] = useState([]);
  const [searchArray, setSearchArray] = useState([]);
  const {user, token} = useContext(MainContext);
  const [searchLoading, setSearchLoading] = useState(false);
  const {getFavouritesByFileId} = useFavourite();
  const {getUserById} = useUser();
  const [searchState, setSearch] = useState(true);

  const fetchData = async () => {
    // filter avatar and current user
    if (mediaArray.length > 0) {
      let array = mediaArray.filter((obj) => obj.user_id !== user.user_id);
      // console.log('file in search', array);

      // filter most favourite person
      const arrayListFavourite = await Promise.all(
        array.map(async (obj) => {
          const listFavouriteByFile = await getFavouritesByFileId(obj.file_id);
          const result = {
            user_id: obj.user_id,
            liked: listFavouriteByFile.length,
          };
          return result;
        })
      );
      // console.log('list favorite', arrayListFavourite);

      // create array of user and remove duplicate
      let arrayUser = arrayListFavourite.map((obj) => {
        return obj.user_id;
      });
      arrayUser = [...new Set(arrayUser)];

      arrayUser = arrayUser.map((obj) => {
        let numberOfLike = 0;
        for (let i = 0; i < arrayListFavourite.length; i++) {
          if (obj === arrayListFavourite[i].user_id)
            numberOfLike += arrayListFavourite[i].liked;
        }
        const result = {user_id: obj, numberOfLiked: numberOfLike};
        return result;
      });
      // console.log('array user like', arrayUser);

      const max = [
        {user_id: 0, max: 0},
        {user_id: 0, max: 0},
        {user_id: 0, max: 0},
        {user_id: 0, max: 0},
      ];
      // set the first max
      arrayUser.forEach((obj) => {
        if (obj.numberOfLiked > max[0].max) {
          max[0].user_id = obj.user_id;
          max[0].max = obj.numberOfLiked;
        }
      });
      // set the second max
      arrayUser.forEach((obj) => {
        if (obj.numberOfLiked >= max[1].max && obj.user_id !== max[0].user_id) {
          max[1].user_id = obj.user_id;
          max[1].max = obj.numberOfLiked;
        }
      });
      // set the third max
      arrayUser.forEach((obj) => {
        if (
          obj.numberOfLiked >= max[2].max &&
          obj.user_id !== max[0].user_id &&
          obj.user_id !== max[1].user_id
        ) {
          max[2].user_id = obj.user_id;
          max[2].max = obj.numberOfLiked;
        }
      });
      // set the fourth max
      arrayUser.forEach((obj) => {
        if (
          obj.numberOfLiked >= max[3].max &&
          obj.user_id !== max[0].user_id &&
          obj.user_id !== max[1].user_id &&
          obj.user_id !== max[2].user_id
        ) {
          max[3].user_id = obj.user_id;
          max[3].max = obj.numberOfLiked;
        }
      });
      // console.log('max person', max);

      // filter for display 4 person
      array = mediaArray.filter((obj) => obj.title.toLowerCase() === 'avatar');
      array = array.filter((obj) => {
        return (
          obj.user_id === max[0].user_id ||
          obj.user_id === max[1].user_id ||
          obj.user_id === max[2].user_id ||
          obj.user_id === max[3].user_id
        );
      });
      // console.log('file in search after filter', array);

      array = await Promise.all(
        array.map(async (obj) => {
          const users = await getUserById(obj.user_id, token);
          const additionData = await JSON.parse(users.full_name);
          obj.description = users.username + ', ' + additionData.location;
          return obj;
        })
      );
      // console.log('new array', array);

      // set data for display
      setMedia(array);
      // console.log('media', media);
    }
  };

  const search = async () => {
    // filter avatar and current user
    let array = mediaArray.filter(
      (obj) => obj.title.toLowerCase() === 'avatar'
    );
    array = array.filter((obj) => obj.user_id !== user.user_id);

    // switch to user to catch username
    let userData = await Promise.all(
      array.map(async (obj) => {
        const userByFile = await getUserById(obj.user_id, token);
        return userByFile;
      })
    );

    // console.log('input', text);
    userData = userData.filter((obj) => {
      return obj.username.toLowerCase().includes(text.toLowerCase());
    });
    userData = userData.map((obj) => {
      return obj.user_id;
    });

    array = array.filter((obj) => {
      return userData.includes(obj.user_id);
    });
    array = await Promise.all(
      array.map(async (obj) => {
        const users = await getUserById(obj.user_id, token);
        const additionData = await JSON.parse(users.full_name);
        obj.description = users.username + ', ' + additionData.location;
        return obj;
      })
    );
    setSearchArray(array);
    // console.log('search array', searchArray);
  };

  useEffect(() => {
    fetchData();
  }, [mediaArray, searchLoading]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setText('');
        // setLoading(!loading);
        setSearchLoading(!searchLoading);
        setSearch(true);
      };
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
          }}
        >
          <Menu
            style={styles.menuBox}
            visible={visible}
            anchor={
              <MenuIcon
                style={styles.menu}
                onPress={() => {
                  showMenu();
                }}
              ></MenuIcon>
            }
            onRequestClose={hideMenu}
          >
            <MenuItem
              pressColor={'#FDC592'}
              textStyle={styles.textMenu}
              onPress={() => {
                hideMenu();
                navigation.navigate('Modify user');
              }}
            >
              Account
            </MenuItem>
            <MenuItem
              pressColor={'#FDC592'}
              textStyle={styles.textMenu}
              onPress={() => {
                hideMenu();
                navigation.navigate('Instructions');
              }}
            >
              How Hook works
            </MenuItem>
          </Menu>
          <Text style={styles.appName}>hook</Text>
          <Text style={{color: 'white'}}>Text</Text>
        </View>
        <Searchbar
          iconColor="#82008F"
          style={styles.searchBar}
          inputStyle={{color: '#EB6432'}}
          placeholder="Looking for someone?"
          onChangeText={(text) => setText(text)}
          value={text}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 5,
          }}
        >
          <Button
            contentStyle={{width: 95}}
            labelStyle={styles.labelButton}
            style={styles.buttons}
            onPress={() => {
              search();
              setSearch(false);
            }}
          >
            Search
          </Button>
          <Button
            labelStyle={styles.labelButton}
            style={styles.buttons}
            onPress={() => {
              setText('');
              // setLoading(!loading);
              setSearchLoading(!searchLoading);
              setSearch(true);
            }}
          >
            Clear
          </Button>
        </View>
        {searchState === true ? (
          <>
            <Text style={styles.header}>TOP PICKS</Text>
            <FlatList
              columnWrapperStyle={{flex: 1, justifyContent: 'space-around'}}
              numColumns={2}
              showsHorizontalScrollIndicator={false}
              horizontal={false}
              data={media}
              keyExtractor={(item) => item.file_id.toString()}
              renderItem={({item}) => (
                <ListItem
                  onPress={() => {
                    navigation.navigate('Single', {file: item});
                  }}
                >
                  {item ? (
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        style={styles.avatar}
                        avatarStyle={{
                          borderRadius: 10,
                        }}
                        source={{uri: uploadsUrl + item.filename}}
                      />
                      <Text style={styles.username}>{item.description}</Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </ListItem>
              )}
            ></FlatList>
          </>
        ) : (
          <>
            {searchArray.length == 0 ? (
              <>
                <Text style={styles.notFoundText}>
                  Sorry we could not find that person for you.
                </Text>
                <LottieView
                  style={{width: '80%', alignSelf: 'center'}}
                  ref={animation}
                  source={require('../assets/animation/empty.json')}
                  autoPlay
                  loop={true}
                  resizeMode="cover"
                  onAnimationFinish={() => {
                    console.log('animation finished');
                  }}
                />
              </>
            ) : (
              <FlatList
                columnWrapperStyle={{flex: 1, justifyContent: 'space-around'}}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                horizontal={false}
                data={searchArray}
                keyExtractor={(item) => item.file_id.toString()}
                renderItem={({item}) => (
                  <ListItem
                    onPress={() => {
                      navigation.navigate('Single', {file: item});
                    }}
                  >
                    {item ? (
                      <View
                        style={{
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Avatar
                          style={styles.avatar}
                          avatarStyle={{
                            borderRadius: 10,
                          }}
                          source={{uri: uploadsUrl + item.filename}}
                        />
                        <Text style={styles.username}>{item.description}</Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </ListItem>
                )}
              ></FlatList>
            )}
          </>
        )}
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  menu: {
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  menuBox: {
    marginTop: 45,
    marginLeft: 10,
    borderRadius: 5,
  },
  textMenu: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  appName: {
    fontSize: 40,
    fontFamily: 'Poppins_700Bold',
    color: '#EB6833',
    letterSpacing: 5,
  },
  header: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    color: '#EB6432',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 15,
  },
  avatar: {
    height: 220,
    width: 170,
  },
  username: {
    fontSize: 17,
    fontFamily: 'Poppins_500Medium',
  },
  searchBar: {
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    fontFamily: 'Poppins_500Medium',
  },
  buttons: {
    width: 90,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#82008F',
  },
  labelButton: {
    fontSize: 13,
  },
  notFoundText: {
    alignSelf: 'center',
    marginTop: '15%',
    marginBottom: '5%',
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: 'black',
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
