/*
  Author: Joseph Sikowitz
  November 2026
*/

import { useContext, createContext } from "react";

export const UserContext = createContext(undefined);
export const SetUserContext = createContext(() => {});

export const useUser = () => {
  return useContext(UserContext);
};

export const useSetUser = () => {
  return useContext(SetUserContext);
}