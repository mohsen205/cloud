import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useProSidebar } from "react-pro-sidebar";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchSasTokens } from "../../store/features/sasTokenSlice";
import { Sidebar } from "../../components/internal-component";
import {
  Clients,
  Users,
  Functions,
  SiteMobileSettings,
  Archive,
  ShiftsDraft,
  ShiftsOngoing,
  ShiftAwaiting,
  ShiftDetails,
  Dashboard,
  ShiftAccomplished,
  TimeSheet,
} from "./";

const DashboardContent = () => {
  const { collapsed } = useProSidebar();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSasTokens());
  }, []);
  return (
    <Box sx={{ display: "flex", backgroundColor: "#F1F4FA" }}>
      <Sidebar />
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          marginLeft: collapsed ? "80px" : "240px",
          pb: 1,
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="functions" element={<Functions />} />
          <Route path="clients" element={<Clients />} />
          <Route path="/shifts/*">
            <Route path="draft" element={<ShiftsDraft />} />
            <Route path="awaiting" element={<ShiftAwaiting />} />
            <Route path="ongoing" element={<ShiftsOngoing />} />
            <Route
              path="ongoing/shifts-details/:id"
              element={<ShiftDetails />}
            />
            <Route path="accomplished" element={<ShiftAccomplished />} />
          </Route>
          <Route path="archive" element={<Archive />} />
          <Route path="time-sheet" element={<TimeSheet />} />
          <Route path="site-mobile-setting" element={<SiteMobileSettings />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DashboardContent;
