import { useState, useRef, useEffect } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Topbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="h-16 bg-white shadow-md px-6 flex items-center justify-between">
            <div className="flex items-center"></div>

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <FaBell className="w-6 h-6 cursor-pointer" />
                    <span className="absolute cursor-pointer -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center border-2 border-white">
                        3
                    </span>
                </button>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center cursor-pointer space-x-5 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                    >
                        <div className="text-right cursor-pointer">
                            <p className="text-sm font-medium text-gray-700">John Doe</p>
                            <p className="text-xs text-gray-500">Teacher</p>
                        </div>
                        <div className="relative cursor-pointer">
                            <FaUserCircle className="w-10 h-10 text-gray-600" />
                            <div className={`absolute bottom-0 cursor-pointer right-0 w-3 h-3 rounded-full border-2 border-white ${showProfileMenu ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                            <Link
                                to="/profile"
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <FaUser className="w-5 h-5" />
                                <span>View Profile</span>
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <FaCog className="w-5 h-5" />
                                <span>Settings</span>
                            </Link>
                            <hr className="my-2 border-gray-200" />
                            <button
                                onClick={() => {/* Add logout logic */ }}
                                className="flex items-center cursor-pointer space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full"
                            >
                                <FaSignOutAlt className="w-5 h-5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Topbar;
