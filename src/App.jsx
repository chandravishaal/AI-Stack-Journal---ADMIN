import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";

import AdminDashboard from "./pages/AdminDashboard";
import PostsPage from "./pages/PostsPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="posts" element={<PostsPage />} />
                <Route path="posts/create" element={<CreatePostPage />} />
                <Route path="posts/edit/:id" element={<EditPostPage />} />
                {/* Redirect /admin to /admin/dashboard */}
                <Route path="" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AdminLayout>
          }
        />
        {/* Optionally redirect root to admin */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
