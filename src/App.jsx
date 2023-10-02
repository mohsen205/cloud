import React from "react";
import { Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ProSidebarProvider } from "react-pro-sidebar";
import { ForgetPassword, NotFound, ResetPassword, Login } from "./pages";

import ProtectedRoutes from "./components/utils/ProtectedRoutes";
import PublicRoutes from "./components/utils/PublicRoutes";
import DashboardContent from "./pages/dashboard/DashboardContent";

const App = () => {
  return (
    <SnackbarProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/forget-password"
          element={
            <PublicRoutes>
              <ForgetPassword />
            </PublicRoutes>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoutes>
              <ResetPassword />
            </PublicRoutes>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoutes>
              <ProSidebarProvider>
                <DashboardContent />
              </ProSidebarProvider>
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SnackbarProvider>
  );
};

export default App;
