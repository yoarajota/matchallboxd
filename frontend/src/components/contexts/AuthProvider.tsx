import api from "@lib/axios";
import { AxiosError, AxiosResponse } from "axios";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
interface AuthContextType {
  user: User | null;
  signin: (user: User, callback: VoidFunction | null) => void;
  signup: (user: User, callback: VoidFunction | null) => void;
  signout: (callback: VoidFunction | null) => void;
  queryingUser: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);

export default function AuthProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [queryingUser, setQueryingUser] = useState<boolean>(true);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      const fetchUser = async () => {
        if (!user) {
          try {
            const response: AxiosResponse = await api.get("me");
            setUser(response.data.data.user);
          } catch (error) {
            console.error(error);
          }
        }

        setQueryingUser(false);
      };

      fetchUser();
      didMountRef.current = true;
    }
  }, []);

  const signin = useCallback(
    (signInUser: User, callback: VoidFunction | null = null) => {
      api
        .post("sign-in", signInUser)
        .then((response: AxiosResponse) => {
          setUser(response.data.data.user);

          if (callback) {
            callback();
          }
        })
        .catch((error: AxiosError) => {
          toast.error((error.response?.data as ErrorResponse).message);
        });
    },
    []
  );

  const signup = useCallback(
    (newUser: User, callback: VoidFunction | null = null) => {
      api
        .post("sign-up", newUser)
        .then((response: AxiosResponse) => {
          toast.success((response?.data as SuccessResponse).message);

          if (callback) {
            callback();
          }
        })
        .catch((error: AxiosError) => {
          toast.error((error.response?.data as ErrorResponse).message);
        });
    },
    []
  );

  const signout = useCallback((callback: VoidFunction | null = null) => {
    setUser(null);

    api
      .post("sign-out")
      .then(() => {
        if (callback) {
          callback();
        }
      })
      .catch(() => {});
  }, []);

  const value = { user, signin, signup, signout, queryingUser };

  return !queryingUser ? (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  ) : (
    <></>
  );
}
