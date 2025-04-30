import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaHome, FaCalendarAlt, FaBars, FaChevronLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: FaHome },
        { path: '/exams', name: 'Exam Management', icon: FaBook },

    ];

    const isActiveLink = (path) => location.pathname === path;

    return (
        <motion.div
            className={`min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 relative`}
            initial={false}
            animate={{ width: isOpen ? 256 : 80 }}
        >
            <div className="p-4 flex items-center justify-between">
                <AnimatePresence>
                    {isOpen && (
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
                        >
                            Smart School
                        </motion.h2>
                    )}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                >
                    {isOpen ? <FaChevronLeft /> : <FaBars />}
                </motion.button>
            </div>

            <nav className="mt-9 space-y-5 px-3">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-all duration-200
                            ${isActiveLink(item.path) ? 'bg-gray-800 text-indigo-400 shadow-lg shadow-indigo-500/20' : ''}`}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <item.icon className={`w-6 h-6 ${isActiveLink(item.path) ? 'text-indigo-400' : ''}`} />
                        </motion.div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="ml-3 font-medium"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                ))}
            </nav>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-gray-800 rounded-lg p-4 shadow-lg"
                        >
                            <p className="text-xs text-gray-400 text-center">Smart School v1.0</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Sidebar;
