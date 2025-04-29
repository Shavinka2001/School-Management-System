// src/components/Student/RecentAnnouncements.jsx
import React from 'react';
import { Bell, Calendar } from 'lucide-react';

const AnnouncementItem = ({ announcement }) => {
  return (
    <div className="border-b border-gray-200 last:border-0 p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-800">{announcement.title}</h4>
        <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1">
          {announcement.type}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-gray-500">{announcement.from}</span>
        <span className="text-xs text-gray-400">
          {new Date(announcement.date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const RecentAnnouncements = ({ announcements = [] }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Announcements</h2>
        <a href="/student/announcements" className="text-blue-600 text-sm hover:underline">View All</a>
      </div>
      
      <div className="divide-y divide-gray-200">
        {announcements.length > 0 ? (
          announcements.slice(0, 5).map((announcement, index) => (
            <AnnouncementItem key={index} announcement={announcement} />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Bell className="mx-auto mb-2 text-gray-400" size={32} />
            <p>No recent announcements</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentAnnouncements;