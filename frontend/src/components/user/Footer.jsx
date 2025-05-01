import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaCalendarAlt, FaUserGraduate, FaChalkboardTeacher, FaClipboardList } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* School Info */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <FaGraduationCap className="text-blue-400 mr-2 text-2xl" />
                            <span className="text-xl font-bold">School Management</span>
                        </div>
                        <p className="text-gray-400">
                            Empowering educational institutions with comprehensive management solutions.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/exams" className="text-gray-400 hover:text-white transition">
                                    Exams
                                </Link>
                            </li>
                            <li>
                                <Link to="/assignments" className="text-gray-400 hover:text-white transition">
                                    Assignments
                                </Link>
                            </li>
                            <li>
                                <Link to="/classes" className="text-gray-400 hover:text-white transition">
                                    Classes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/schedule" className="text-gray-400 hover:text-white transition">
                                    Schedule
                                </Link>
                            </li>
                            <li>
                                <Link to="/grades" className="text-gray-400 hover:text-white transition">
                                    Grades
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="text-gray-400 hover:text-white transition">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className="text-gray-400 hover:text-white transition">
                                    Help Center
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400">
                                Email: support@schoolmanagement.com
                            </li>
                            <li className="text-gray-400">
                                Phone: (123) 456-7890
                            </li>
                            <li className="text-gray-400">
                                Address: 123 Education Street, Learning City
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} School Management System. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;