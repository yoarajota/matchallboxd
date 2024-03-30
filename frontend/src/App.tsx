import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthProvider from "./components/contexts/AuthProvider";
import Sign from "./components/auth/Sign";
import RequireAuth from "./components/auth/RequireAuth";
import { Toaster } from "@/components/ui/sonner";
import Menu from "./components/pages/Menu";
import Room from "./components/pages/Room";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/sign-in" element={<Sign signin />} />
          <Route path="/sign-up" element={<Sign />} />
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Menu />
                </RequireAuth>
              }
            />
            <Route
              path="/room/:id"
              element={
                <RequireAuth>
                  <Room />
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
    <main>
      <Outlet />
    </main>
  );
}
