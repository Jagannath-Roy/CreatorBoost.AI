import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
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
        <div className="bg-background text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 w-full z-50 backdrop-blur-xl border-b border-border-subtle bg-glass-bg">
                <div className="flex justify-end sm:justify-between items-center px-6 md:px-margin-lg h-20 max-w-container-max mx-auto">
                    <Link className="hidden sm:block font-headline-md text-headline-md font-bold text-primary" to="/">CreatorBoost.ai</Link>
                    <Link to="/login" className="bg-primary text-on-primary text-[13px] px-4 py-1.5 sm:font-label-md sm:px-6 sm:py-2.5 rounded-xl hover:opacity-80 transition-opacity active:scale-95 duration-200 inline-block text-center">Login</Link>
                </div>
            </header>

            {/* Main Content: Sign Up Card */}
            <main className="flex-grow flex items-center justify-center px-margin-sm py-4">
                <div className="w-full max-w-[460px] glass-card rounded-xl p-6 flex flex-col gap-4">
                    {/* Header Section */}
                    <div className="text-center space-y-1">
                        <h1 className="font-headline-lg text-[28px] leading-[36px] font-semibold text-on-surface">Create your account</h1>
                        <p className="font-body-md text-[15px] text-slate-gray">Join thousands of creators boosting their content.</p>
                    </div>

                    {/* Social Action */}
                    <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 border border-border-subtle rounded-xl font-label-md text-on-surface hover:bg-white/5 transition-colors active:scale-[0.98] duration-200">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign up with Google
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-border-subtle"></div>
                        <span className="flex-shrink mx-4 font-label-sm text-label-sm text-slate-gray tracking-widest uppercase">OR EMAIL</span>
                        <div className="flex-grow border-t border-border-subtle"></div>
                    </div>

                    {/* Form */}
                    <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1 group">
                            <label className="font-label-sm text-label-sm text-slate-gray group-focus-within:text-primary transition-colors ml-1" htmlFor="name">Full Name</label>
                            <input 
                                className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-2 focus:outline-none focus:border-primary transition-colors text-on-surface placeholder:text-slate-gray/50" 
                                id="name" 
                                placeholder="Jagannath Roy" 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1 group">
                            <label className="font-label-sm text-label-sm text-slate-gray group-focus-within:text-primary transition-colors ml-1" htmlFor="email">Email Address</label>
                            <input 
                                className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-2 focus:outline-none focus:border-primary transition-colors text-on-surface placeholder:text-slate-gray/50" 
                                id="email" 
                                placeholder="jagannath@gmail.com" 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 group">
                            <label className="font-label-sm text-label-sm text-slate-gray group-focus-within:text-primary transition-colors ml-1" htmlFor="password">Password</label>
                            <div className="relative">
                                <input 
                                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-4 py-2 focus:outline-none focus:border-primary transition-colors text-on-surface placeholder:text-slate-gray/50" 
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
                                    <span className="material-symbols-outlined text-[18px]" data-icon={showPassword ? "visibility_off" : "visibility"}>{showPassword ? "visibility_off" : "visibility"}</span>
                                </button>
                            </div>
                        </div>

                        <button 
                            className="w-full glow-button bg-primary text-on-primary font-label-md py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] duration-200 mt-1 disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    {/* Bottom Link */}
                    <div className="text-center">
                        <p className="font-body-sm text-body-sm text-slate-gray">
                            Already have an account? 
                            <Link className="text-primary font-medium hover:underline ml-1" to="/login">Log in</Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-margin-md border-t border-border-subtle bg-surface mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center px-margin-lg max-w-container-max mx-auto gap-4">
                    <div className="font-headline-sm text-headline-sm text-on-surface">CreatorBoost.ai</div>
                    <div className="flex gap-8">
                        <Link className="font-body-sm text-body-sm text-slate-gray hover:text-primary transition-colors" to="#">Privacy</Link>
                        <Link className="font-body-sm text-body-sm text-slate-gray hover:text-primary transition-colors" to="#">Terms</Link>
                        <Link className="font-body-sm text-body-sm text-slate-gray hover:text-primary transition-colors" to="#">Contact</Link>
                    </div>
                    <div className="font-body-sm text-body-sm text-slate-gray">
                        © 2026 CreatorBoost.ai
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Register;
