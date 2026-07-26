import {
  LayoutDashboard,
  FileText,
  Bot,
  History,
  Settings
} from "lucide-react";
import { LogOut } from "lucide-react";
import { X } from "lucide-react";
import logo from "../assets/logo.jpeg";
import ConfirmModal from "../pages/ConfirmModal";
import { useState } from "react";

export default function Sidebar({
    currentPage,
    setCurrentPage,
    setIsLoggedIn,
    sidebarOpen,
    setSidebarOpen,
    showLogoutModal,
    setShowLogoutModal
}) {

  const menu = [
    { name: "Dashboard", key: "dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Resume Analyzer", key: "resume", icon: <FileText size={18} /> },
    { name: "AI Interviewer", key: "interview", icon: <Bot size={18} /> },
    { name: "History", key: "history", icon: <History size={18} /> },
    { name: "Settings", key: "settings", icon: <Settings size={18} /> }
  ];


  return (
    <div className="h-full flex flex-col p-4">
        {/* Mobile Close Button */}

        <div className="lg:hidden flex justify-end mb-2">

            <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded hover:bg-gray-100"
            >
                <X size={24} />
            </button>

        </div>

      {/* LOGO */}
      <div className="flex items-center gap-3 px-2 py-4 mb-4">
        <img src={logo} alt="logo" className="w-8 h-8 object-contain" />

        <h1 className="text-lg font-bold text-indigo-700 tracking-wide">
          ElevraPath
        </h1>
      </div>

      {/* MENU */}
      <div className="space-y-2">
        {menu.map((item) => (
          <div
            key={item.key}
            onClick={() => setCurrentPage(item.key)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
            ${
                currentPage === item.key
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-indigo-50 text-gray-700"
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="mt-auto pt-4">
        <div
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-200 rounded"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>


    </div>
  );
}