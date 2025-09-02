import React from "react";
import { RiSideBarLine } from "react-icons/ri";

export default function AdminHeader({ openSidebar }) {
  return (
    <header className="flex justify-between items-center p-4 bg-black border-b border-yellow-400 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile menu button only */}
        <button
          className="sm:hidden bg-yellow-400 text-black p-2 rounded-lg shadow"
          onClick={openSidebar}
          aria-label="Open sidebar"
        >
          <RiSideBarLine size={24} />
        </button>

        <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
          AI Stack Journal Admin
        </h1>
      </div>

      <button className="px-3 py-1 border border-yellow-400 rounded hover:bg-yellow-400 hover:text-black transition">
        Logout
      </button>
    </header>
  );
}
