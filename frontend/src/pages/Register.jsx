import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password);
            toast.success("Registration successful! Please login.");
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 transition-colors duration-200">
                <div className="text-center">
                    <Sparkles className="mx-auto h-12 w-12 text-indigo-600" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Create an account</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Join CreatorBoost AI today
                    </p>
                </div>

                <div className="flex p-1 mt-6 space-x-1 bg-gray-100 dark:bg-slate-700 rounded-xl">
                    <Link to="/login" className="w-full py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-center rounded-lg transition-colors">Login</Link>
                    <button className="w-full py-2.5 text-sm font-medium leading-5 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-800 rounded-lg shadow">Register</button>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input
                                type="text"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-200"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
