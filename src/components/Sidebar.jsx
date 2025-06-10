import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Building2,
  MailCheck,
  StickyNote,
  Star,
  MessageSquareMore,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard />, label: "Dashboard", path: "/dashboard" },
    { icon: <Building2 />, label: "Add Department", path: "/add-department" },
    { icon: <Building2 />, label: "Manage Department", path: "/manage-department" },
    { icon: <MailCheck />, label: "Newsletter", path: "/newsletter" },
    { icon: <StickyNote />, label: "Surveys", path: "/surveys" },
    { icon: <Star />, label: "Success Stories", path: "/success-stories" },
    { icon: <MessageSquareMore />, label: "Feedback", path: "/feedback" },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-[#1f003d] to-[#3f0075] text-white h-screen p-5 flex flex-col shadow-2xl rounded-r-2xl font-['Poppins'] relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none z-0"></div>

      {/* Logo */}
      <div className="flex justify-center items-center mb-6 z-10">
        <img
          src="/Logo.png"
          alt="University Logo"
          className="w-16 h-16 object-contain border-4 border-purple-500 rounded-full shadow-md"
        />
      </div>

      {/* Title */}
   <div className="w-full max-w-screen-md mx-auto">
  <h2
    className="text-2xl font-bold text-center text-purple-200 mb-6 tracking-wider drop-shadow z-10"
    style={{ fontFamily: "'Oleo Script Swash Caps', cursive" }}
  >
    Admin Panel
  </h2>
</div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 relative z-10">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 px-4 py-2 text-[15px] font-medium rounded-md cursor-pointer group transition-all duration-300 ${
              location.pathname === item.path
                ? "bg-purple-600 bg-opacity-90 shadow-lg text-white"
                : "hover:bg-purple-500 hover:bg-opacity-80 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)] text-purple-200"
            }`}
          >
            <span className="text-xl text-yellow-300 group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="group-hover:text-white">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div
        onClick={() => navigate("/login")}
        className="flex items-center gap-4 px-4 py-2 mt-4 text-[15px] font-medium rounded-md cursor-pointer group hover:bg-red-500 hover:bg-opacity-80 hover:shadow-[0_0_10px_rgba(239,68,68,0.4)] text-red-300 hover:text-white transition-all duration-300 z-10"
      >
        <LogOut className="text-xl group-hover:scale-110 transition-transform" />
        <span>Logout</span>
      </div>
    </aside>
  );
};

export default Sidebar;
