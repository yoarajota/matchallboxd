import { useAuth } from "@/lib/auth";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /Sign page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they Sign, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/Sign" state={{ from: location }} replace />;
    }

    return children;
}