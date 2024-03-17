import { Link, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthProvider from "./components/contexts/AuthProvider";
import Sign from "./components/auth/Sign";
import RequireAuth from "./components/auth/RequireAuth";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/sign-in" element={<Sign signin />} />
          <Route path="/sign-up" element={<Sign signup />} />
          <Route element={<Layout />}>
            <Route path="/" element={<PublicPage />} />
            <Route
              path="/protected"
              element={
                <RequireAuth>
                  <ProtectedPage />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
      <Toaster />
    </>
  );
}

function Layout() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}
