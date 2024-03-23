import api from "@lib/axios";
import { AxiosError, AxiosResponse } from "axios";
import { createContext, useState } from "react";

interface AuthContextType {
  user: User | null;
  signin: (user: User, callback: VoidFunction | null) => void;
  signup: (user: User, callback: VoidFunction | null) => void;
  signout: (callback: VoidFunction | null) => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const signin = (signInUser: User, callback: VoidFunction | null = null) => {
    api.post("sign-in", signInUser).then((response: AxiosResponse) => {
      setUser(signInUser);

      if (callback) {
        callback();
      }
    }).catch((error: AxiosError) => {

    })
  };

  const signup = (newUser: User, callback: VoidFunction | null = null) => {
    api.post("sign-up", newUser).then((response: AxiosResponse) => {
      setUser(newUser);

      if (callback) {
        callback();
      }
    }).catch((error: AxiosError) => {

    })
  };

  const signout = (callback: VoidFunction | null = null) => {
    setUser(null);

    api.post("sign-out").then((response: AxiosResponse) => {
      if (callback) {
        callback();
      }
    }).catch((error: AxiosError) => {

    })
  };

  const value = { user, signin, signup, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
