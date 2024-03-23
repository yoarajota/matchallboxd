import { useAuth } from "@lib/utils";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /sign-up page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they Sign, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/sign-up" state={{ from: location }} replace />;
    }

    return children;
}