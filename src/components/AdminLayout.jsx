import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const openSidebar = () => setMobileSidebarOpen(true);
  const closeSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className="flex min-h-screen h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <AdminSidebar isMobileOpen={mobileSidebarOpen} closeSidebar={closeSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full sm:w-[calc(100%-16rem)] h-screen overflow-y-auto">
        {/* Header */}
        <AdminHeader openSidebar={openSidebar} />

        {/* Main */}
        <main className="p-6 flex-1">{children}</main>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
