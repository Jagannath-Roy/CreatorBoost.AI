import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [bgPosition, setBgPosition] = useState('2.11719% 7.65625%');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBgPosition(`${x * 10}% ${y * 10}%`);
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Login successful!");
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="flex flex-col h-screen overflow-hidden text-on-background" 
            style={{
                backgroundColor: '#0F1115',
                backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(192, 193, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(208, 188, 255, 0.05) 0%, transparent 40%)',
                backgroundPosition: bgPosition
            }}
        >
            {/* TopNavBar */}
            <header className="sticky top-0 z-50 w-full bg-glass-bg backdrop-blur-md border-b border-border-subtle">
                <div className="flex justify-end sm:justify-between items-center h-16 px-6 md:px-margin-lg max-w-container-max mx-auto">
                    <Link className="hidden sm:block text-headline-md font-headline-md font-bold text-on-surface" to="/">CreatorBoost.ai</Link>
                    <div className="flex items-center gap-4">
                        <Link to="/register" className="px-4 py-1.5 text-[13px] sm:px-6 sm:py-2 sm:font-label-md bg-primary text-on-primary rounded-xl glow-button transition-all active:scale-95 inline-block text-center flex items-center">Get Started</Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-margin-sm py-2 overflow-y-auto">
                <div className="w-full max-w-[420px]">
                    {/* Login Card */}
                    <div className="glass-card p-6 rounded-xl shadow-2xl flex flex-col gap-4">
                        {/* Branding & Title */}
                        <div className="text-center">
                            <h1 className="text-[24px] font-semibold text-on-surface mb-1">Welcome Back</h1>
                            <p className="text-[14px] text-slate-gray">Fueling your creative workflow with AI.</p>
                        </div>
                        
                        {/* Social Login */}
                        <button type="button" className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-border-subtle hover:bg-surface-container-high transition-colors text-label-md font-label-md text-on-surface">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>Sign in with Google</span>
                        </button>
                        
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-border-subtle"></div>
                            <span className="flex-shrink mx-4 text-label-sm font-label-sm text-slate-gray uppercase tracking-widest">or email</span>
                            <div className="flex-grow border-t border-border-subtle"></div>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-label-sm font-label-sm text-slate-gray ml-1" htmlFor="email">Email address</label>
                                <input 
                                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-2.5 text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant" 
                                    id="email" 
                                    placeholder="Enter you registered email id..." 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-label-sm font-label-sm text-slate-gray" htmlFor="password">Password</label>
                                    <Link className="text-label-sm font-label-sm text-primary hover:underline hidden" to="#">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <input 
                                        className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-2.5 text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant" 
                                        id="password" 
                                        placeholder="••••••••" 
                                        type={showPassword ? "text" : "password"} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-gray hover:text-on-surface" 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                                    </button>
                                </div>
                            </div>

                            <button 
                                className="w-full bg-primary text-on-primary font-label-md py-3 rounded-xl glow-button transition-all active:scale-[0.98] shadow-lg shadow-primary/10 disabled:opacity-50 mt-1" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                        
                        <p className="text-center text-body-sm font-body-sm text-on-surface-variant">
                            Don't have an account?{' '}
                            <Link className="text-primary font-medium hover:underline" to="/register">Create an account</Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-border-subtle shrink-0">
                <div className="px-margin-lg py-3 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-body-sm font-body-sm text-slate-gray">
                        © 2026 CreatorBoost.ai. Built for the next generation of creators.
                    </div>
                    <div className="flex gap-margin-md">
                        <Link className="text-slate-gray font-label-sm hover:text-on-surface transition-colors duration-200" to="#">Privacy</Link>
                        <Link className="text-slate-gray font-label-sm hover:text-on-surface transition-colors duration-200" to="#">Terms</Link>
                        <Link className="text-slate-gray font-label-sm hover:text-on-surface transition-colors duration-200" to="#">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;
