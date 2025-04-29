import React, { useState } from 'react';
import { Search, Bell, MessageCircle, User } from 'lucide-react';

const NotificationItem = ({ notification }) => {
  return (
    <div className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
      <div className="flex items-start">
        <div className={`p-2 rounded-full ${notification.color} text-white mr-3`}>
          {notification.icon}
        </div>
        <div>
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="text-xs text-gray-500">{notification.time}</p>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New assignment due tomorrow',
      time: '1 hour ago',
      icon: <Bell size={16} />,
      color: 'bg-red-500',
    },
    {
      id: 2,
      title: 'Attendance updated',
      time: '3 hours ago',
      icon: <Bell size={16} />,
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'New announcement from Principal',
      time: 'Yesterday',
      icon: <Bell size={16} />,
      color: 'bg-blue-500',
    },
  ];

  const messages = [
    {
      id: 1,
      title: 'Mrs. Johnson: About your project',
      time: '2 hours ago',
      icon: <MessageCircle size={16} />,
      color: 'bg-purple-500',
    },
    {
      id: 2,
      title: 'Alex: Did you complete the homework?',
      time: 'Yesterday',
      icon: <MessageCircle size={16} />,
      color: 'bg-indigo-500',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
                setShowProfile(false);
              }}
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <a href="/student/notifications" className="text-sm text-blue-600 hover:underline">
                    View All Notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
                setShowProfile(false);
              }}
            >
              <MessageCircle size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {messages.length}
              </span>
            </button>

            {showMessages && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800">Messages</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <NotificationItem key={message.id} notification={message} />
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <a href="/student/messages" className="text-sm text-blue-600 hover:underline">
                    View All Messages
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
                setShowMessages(false);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User size={16} />
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800">Student Name</h3>
                  <p className="text-sm text-gray-500">student.email@example.com</p>
                </div>
                <div className="p-4">
                  <a href="/student/profile" className="block text-sm text-blue-600 hover:underline">
                    View Profile
                  </a>
                  <button className="block w-full text-left text-sm text-red-600 hover:underline mt-2">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;