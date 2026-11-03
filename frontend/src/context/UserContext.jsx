import { useContext, createContext } from "react";

export const UserContext = createContext(null);
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used with a UserContext.Provider");
    }
    return context;
};

/* Ken: This version will work for my page, can you test if you use this will work for you?
import { useContext, createContext } from "react";

export const UserContext = createContext(undefined);

export const useUser = () => {
  return useContext(UserContext);
}; */