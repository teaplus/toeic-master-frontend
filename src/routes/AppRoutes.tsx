import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Landing_page from "../pages/landing_page/Landing_Page";
import MainLayout from "../components/layout/MainLayout";
import CreateToeicTest from "../pages/admin/test/CreateToeicTest";
import AdminDashboard from "../pages/admin/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import { ExamInterface } from "../pages/test/ExamInterface";
import ExamPage from "../pages/test/[id]";
import ExamPage2 from "../pages/exam/[id]";
import TestList from "../pages/test/TestList";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Landing_page />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test" element={<TestList />} />
        </Route>
        <Route path="/admin/test/create" element={<CreateToeicTest />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/test/:id" element={<ExamPage />} />
        <Route path="/exam/:id" element={<ExamPage2 />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
