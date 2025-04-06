import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: ""
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fix: Improved checkAuthUser to persist session using localStorage
  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      let userData = JSON.parse(localStorage.getItem("user") || "null");

      if (!userData) {
        const currentAccount = await getCurrentUser();
        if (currentAccount) {
          userData = {
            id: currentAccount.$id,
            name: currentAccount.name,
            username: currentAccount.username,
            email: currentAccount.email,
            imageUrl: currentAccount.imageUrl,
            bio: currentAccount.bio,
          };
          localStorage.setItem("user", JSON.stringify(userData)); // ✅ Store user data for persistence
        } else {
          return false;
        }
      }

      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.log(error);
      localStorage.removeItem("user"); // ✅ Remove corrupted session
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      const isAuthenticated = await checkAuthUser();
      if (!isAuthenticated) {
        navigate("/sign-in"); // ✅ Only navigate if the user is NOT authenticated
      }
    };

    verifyUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
export const useUserContext = () => useContext(AuthContext);
