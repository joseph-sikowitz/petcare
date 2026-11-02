import { useContext, createContext } from "react";

export const UserContext = createContext(null);
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used with a UserContext.Provider");
    }
    return context;
};