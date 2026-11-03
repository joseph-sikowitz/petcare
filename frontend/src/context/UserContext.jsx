/*
  Author: Joseph Sikowitz
  November 2026
*/

import { useContext, createContext } from "react";

export const UserContext = createContext(undefined);

export const useUser = () => {
  return useContext(UserContext);
};