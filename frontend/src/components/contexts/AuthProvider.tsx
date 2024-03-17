import { fakeAuthProvider } from "@/lib/auth";
import { useState } from "react";
import { createContext } from "vm";

interface AuthContextType {
    user: any;
    signin: (user: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = useState<any>(null);

    let signin = (newUser: string, callback: VoidFunction) => {
        return fakeAuthProvider.signin(() => {
            setUser(newUser);
            callback();
        });
    };

    let signout = (callback: VoidFunction) => {
        return fakeAuthProvider.signout(() => {
            setUser(null);
            callback();
        });
    };

    let value = { user, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}