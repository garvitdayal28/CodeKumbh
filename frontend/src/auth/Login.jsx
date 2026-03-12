import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Droplets, UserIcon, Activity, ShieldCheck   } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user'); // 'user', 'doctor', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        console.log('Login successful', data);
        
        // Save to Zustand store
        useAuthStore.getState().setAuth(data.user, data.idToken);
        
        // Role-based redirection
        const userRole = data.user?.role || role;
        if (userRole === 'admin') {
            navigate('/admin/dashboard');
        } else if (userRole === 'doctor') {
            navigate('/doctor/dashboard');
        } else {
            navigate('/user/dashboard');
        }
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-50 to-sage-100 font-sans">
      {/* Left side: Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-primary-950 text-white p-12 relative overflow-hidden">
        {/* Background ambient light effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[40rem] h-[40rem] rounded-full bg-primary-500 blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-[60%] -right-[10%] w-[30rem] h-[30rem] rounded-full bg-sage-500 blur-[100px] mix-blend-screen"></div>
        </div>
        
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 text-center max-w-lg"
        >
          <div className="mb-10 flex justify-center">
            <div className="p-5 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
               <Droplets size={56} className="text-primary-400" />
            </div>
          </div>
          <h1 className="text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">
            RaktSetu
          </h1>
          <p className="text-xl text-primary-200/80 font-light leading-relaxed">
            Smart Healthcare and Donation Network. <br/>
            Connecting lifesavers with those in critical need.
          </p>
        </motion.div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6 sm:p-12 relative overflow-hidden text-slate-800">
          {/* Decorative blur for mobile */}
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-40 mix-blend-multiply pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-sage-200 rounded-full blur-3xl opacity-40 mix-blend-multiply pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="w-full max-w-md z-10"
          >
            <div className="glass p-10 rounded-3xl w-full shadow-xl">
                {/* Mobile Icon */}
                <div className="lg:hidden mb-8 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl shadow-sm border border-primary-100">
                      <Droplets className="text-primary-600" size={32} />
                    </div>
                </div>
                
                <div className="text-center lg:text-left mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
                </div>

                {/* Role Selection */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 text-center lg:text-left">Sign in as</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'user', label: 'User', icon: UserIcon },
                            { id: 'doctor', label: 'Doctor', icon: Activity },
                            { id: 'admin', label: 'Admin', icon: ShieldCheck }
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setRole(item.id)}
                                    className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl border transition-all ${
                                        role === item.id 
                                        ? 'bg-primary-50 border-primary-400 text-primary-600 shadow-sm ring-1 ring-primary-100' 
                                        : 'bg-gray-50/30 border-gray-200 text-gray-400 hover:bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <div className={`p-2 rounded-xl mb-1.5 ${role === item.id ? 'bg-primary-100' : 'bg-gray-100'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 ml-1 font-medium">
                        <div className="flex items-center">
                            <input type="checkbox" id="remember" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">Remember me</label>
                        </div>
                        <a href="#" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
                            Forgot password?
                        </a>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center gap-2 py-4 px-4 mt-2 text-white rounded-2xl font-bold text-lg transition-all shadow-lg ${
                            loading 
                            ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                            : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transform active:scale-[0.98] shadow-primary-500/25'
                        }`}
                    >
                        {loading ? 'Authenticating...' : (
                            <>Sign In <ArrowRight size={22} /></>
                        )}
                    </button>
                    
                    {error && (
                        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-100 font-medium">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/auth/register" className="font-bold text-primary-600 hover:text-primary-800 transition-colors underline decoration-primary-200 underline-offset-4">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
          </motion.div>
      </div>
    </div>
  );
};

export default Login;
