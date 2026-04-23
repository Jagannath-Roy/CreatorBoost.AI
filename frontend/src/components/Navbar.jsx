import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, History, Sparkles, Moon, Sun } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Sparkles className="h-8 w-8 text-indigo-600" />
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                CreatorBoost AI
                            </span>
                        </Link>
                        {user && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link to="/" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium gap-2 transition-colors">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Link to="/history" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium gap-2 transition-colors">
                                    <History className="h-4 w-4" />
                                    History
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        {user && (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Hello, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
