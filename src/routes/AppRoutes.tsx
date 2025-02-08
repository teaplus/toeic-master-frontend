import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import MainLayout from "../components/layout/MainLayout";
import CreateToeicTest from "../pages/admin/test/CreateToeicTest";
import AdminDashboard from "../pages/admin/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import ExamPage from "../pages/test/[id]";
import ExamPage2 from "../pages/exam/[id]";
import TestList from "../pages/test/TestList";
import Verification from "../pages/verification/Verification";
import ResetPassword from "../pages/auth/ResetPassword";
import PageNotFound from "../pages/PageNotFound";
import ReviewPage from "../pages/test/review/[id]";
import ToeicStructure from "../pages/articles/ToeicStructure";
import Leaderboard from "../pages/leaderboard/Leaderboard";


function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tests" element={<TestList />} />
          <Route path="/toeic-structure" element={<ToeicStructure />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
        <Route path="/admin/test/create" element={<CreateToeicTest />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/test/:id/:test_id" element={<ExamPage />} />
        <Route path="/exam/:id" element={<ExamPage2 />} />
        <Route path="/verification/:token" element={<Verification />} />
        <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/test/review/:id/:test_id" element={<ReviewPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
