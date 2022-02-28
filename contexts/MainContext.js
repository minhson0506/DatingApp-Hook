import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(0);
<<<<<<< HEAD
  const [instruction, setInstruction] = useState(false);
=======
>>>>>>> 53751aa716e13f3e6e06181d6a90bf29a098bb89
  const [token, setToken] = useState('fetching...');

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
<<<<<<< HEAD
        instruction,
        setInstruction,
=======
>>>>>>> 53751aa716e13f3e6e06181d6a90bf29a098bb89
        token,
        setToken,
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
