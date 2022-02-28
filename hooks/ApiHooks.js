import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appId, baseUrl} from '../utils/variables';

const doFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.error
        ? `${json.message}: ${json.error}`
        : json.message;
      throw new Error(message || response.statusText);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const useMedia = (myFilesOnly, userId = null) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update, user} = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const loadMedia = async (start = 0, limit = 10) => {
    setLoading(true);
    try {
      let json = await useTag().getFileByTag(appId);
      if (myFilesOnly) {
        json = json.filter((file) => file.user_id === user.user_id);
      }
      if (userId) {
        json = json.filter((file) => file.user_id === userId);
      }
      let media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(baseUrl + 'media/' + item.file_id);
          const mediaData = await response.json();
          // console.log(mediaData);
          return mediaData;
        })
      );
      media = media.filter((obj) => obj.title.toLowerCase() !== 'deleted');
      setMediaArray(media);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    // console.log(mediaArray);
  };

  // Call loadMedia() only once when the component is loaded
  // Or when update state is changed
  useEffect(() => {
    loadMedia(0, 10);
  }, [update]);

  const postMedia = async (formData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
      body: formData,
    };
    return await doFetch(baseUrl + 'media', options);
  };
  const deleteMedia = async (id, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(baseUrl + 'media/' + id, options);
  };

  // const getMediaByUserId = async () => {
  //   return await doFetch(baseUrl + 'media/user' + userId);
  // };
  const putMedia = async (id, token, data) => {
    const options = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'media/' + id, options);
  };
  const getMediaByUserId = async (userId) => {
    const options = {
      method: 'GET',
    };
    return await doFetch(`${baseUrl}media/user/${userId}`, options);
  };

  const getAllMediaByCurrentUserId = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    return await doFetch(baseUrl + 'media/user', options);
  };

  return {
    mediaArray,
    postMedia,
    loading,
    deleteMedia,
    putMedia,
    getMediaByUserId,
    getAllMediaByCurrentUserId,
  };
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    const userData = await doFetch(baseUrl + 'login', options);
    return userData;
  };

  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    const userData = await doFetch(baseUrl + 'users/user', options);
    return userData;
  };

  const getUserById = async (userId, token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    const userData = await doFetch(baseUrl + 'users/' + userId, options);
    return userData;
  };

  const postUser = async (data) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    };
    const userData = await doFetch(baseUrl + 'users', options);
    return userData;
  };

  const putUser = async (data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'users', options);
  };

  // require admin
  const deleteUser = async (userId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    return await doFetch(baseUrl + 'users/' + userId, options);
  };

  const checkUsername = async (username) => {
    const result = await doFetch(baseUrl + 'users/username/' + username);
    return result.available;
  };

  const getFilesByUser = async (token) => {
    const options = {headers: {'x-access-token': token}};
    return await doFetch(baseUrl + '/media/user', options);
  };

  return {
    // userArray,
    getUserByToken,
    postUser,
    putUser,
    checkUsername,
    deleteUser,
    getUserById,
    getFilesByUser,
  };
};

const useTag = () => {
  const postTag = async (tagData, token) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(tagData),
    };
    return await doFetch(baseUrl + 'tags/', options);
  };

  const getFileByTag = async (tag) => {
    return await doFetch(baseUrl + 'tags/' + tag);
  };

  return {postTag, getFileByTag};
};

const userComment = () => {
  const deleteComment = async (commentId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    return await doFetch(baseUrl + 'comments/' + commentId, options);
  };

  const postComment = async (data, token) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      body: JSON.stringify(data),
    };
    return await doFetch(baseUrl + 'comments', options);
  };

  const getCommentByFileId = async (fileId) => {
    const options = {
      method: 'GET',
    };
    return await doFetch(baseUrl + 'comments/file/' + fileId, options);
  };

  const getComments = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    return await doFetch(baseUrl + 'comments', options);
  };

  return {
    userComment,
    postComment,
    getComments,
    getCommentByFileId,
    deleteComment,
  };
};

const userFavourite = () => {
  const postFavourite = async (data, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({file_id: data}),
    };
    return await doFetch(baseUrl + 'favourites/', options);
  };

  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    return await doFetch(baseUrl + 'favourites/files/' + fileId, options);
  };

  const getFavouritesByFileId = async (fileId) => {
    return await doFetch(`${baseUrl}favourites/file/${fileId}`);
  };

  const getFavourites = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    return await doFetch(baseUrl + 'favourites', options);
  };

  return {postFavourite, deleteFavourite, getFavourites, getFavouritesByFileId};
};

export {useMedia, useLogin, useUser, useTag, userComment, userFavourite};
