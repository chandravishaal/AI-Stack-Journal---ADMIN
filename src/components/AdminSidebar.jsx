import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar({ isMobileOpen, closeSidebar }) {
  const baseClass =
    "block py-3 px-5 rounded-lg text-white transition-all hover:bg-yellow-400 hover:text-black";

  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Manage Posts", path: "/admin/posts" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          bg-black border-r border-yellow-400 p-4 flex flex-col
          w-64 min-h-screen
          transform transition-transform duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          sm:sticky sm:top-0 sm:translate-x-0 sm:h-screen
        `}
      >
        {/* Close button for mobile */}
        <button
          className="sm:hidden self-end mb-4 text-white text-2xl"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          ×
        </button>

        {/* Links */}
        <nav className="flex flex-col gap-2 mt-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "bg-yellow-400 text-black " + baseClass : baseClass
              }
              onClick={closeSidebar} 
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
