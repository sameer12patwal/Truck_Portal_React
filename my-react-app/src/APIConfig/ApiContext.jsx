import React, { createContext, useContext } from 'react';
import config from './config';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  return (
    <ApiContext.Provider value={config.baseUrl}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};