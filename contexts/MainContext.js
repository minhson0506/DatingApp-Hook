import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(0);
  const [instruction, setInstruction] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(0);
  const [token, setToken] = useState('fetching...');
  const [loading, setLoading] = useState(false);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
        instruction,
        setInstruction,
        updateInfo,
        setUpdateInfo,
        token,
        setToken,
        loading,
        setLoading,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
