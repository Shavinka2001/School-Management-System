// src/components/shared/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  FileText, 
  Bell, 
  MessageCircle, 
  Clock, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

const SidebarLink = ({ icon, label, to, active }) => {
  const Icon = icon;
  return (
    <Link
      to={to}
      className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} className="mr-3" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  const sidebarLinks = [
    { icon: Home, label: 'Dashboard', to: '/student/dashboard' },
    { icon: BookOpen, label: 'Courses', to: '/student/courses' },
    { icon: FileText, label: 'Assignments', to: '/student/assignments' },
    { icon: Calendar, label: 'Timetable', to: '/student/timetable' },
    { icon: Bell, label: 'Announcements', to: '/student/announcements' },
    { icon: MessageCircle, label: 'Messages', to: '/student/messages' },
    { icon: Clock, label: 'Attendance', to: '/student/attendance' },
    { icon: Settings, label: 'Settings', to: '/student/settings' },
  ];

  return (
    <div 
      className={`bg-white shadow-lg transition-all ${
        collapsed ? 'w-20' : 'w-64'
      } flex flex-col h-screen`}
    >
      {/* Logo */}
      <div className="flex items-center p-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-xl font-bold text-blue-600">EduMaster</h1>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-full hover:bg-gray-100 ${collapsed ? 'mx-auto' : 'ml-auto'}`}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Student Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Student Name</h3>
              <p className="text-sm text-gray-500">Class X-B</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {sidebarLinks.map((link, index) => (
            collapsed ? (
              <Link
                key={index}
                to={link.to}
                className={`flex justify-center p-3 rounded-lg transition-colors ${
                  isActive(link.to) 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <link.icon size={20} />
              </Link>
            ) : (
              <SidebarLink
                key={index}
                icon={link.icon}
                label={link.label}
                to={link.to}
                active={isActive(link.to)}
              />
            )
          ))}
        </nav>
      </div>
      
      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        {collapsed ? (
          <button className="mx-auto flex justify-center p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} />
          </button>
        ) : (
          <button className="flex items-center py-3 px-4 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;