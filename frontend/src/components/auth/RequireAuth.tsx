import { useAuth } from "@lib/utils";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    const auth = useAuth();
    const location = useLocation();

    if (!auth.user) {
        return <Navigate to="/sign-up" state={{ from: location }} replace />;
    }

    return children;
}