import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Droplets, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    pincode: '',
    bloodGroup: '',
    dob: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        console.log('Registration successful', data);
        // TODO: Redirect to login or auto-login depending on preference
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-50 to-sage-100 font-sans">
      
      {/* Background blurs for visual depth */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-primary-300/20 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-sage-400/20 blur-[100px]"></div>
      </div>

      <div className="w-full flex justify-center items-center p-6 sm:p-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-4xl"
          >
            <div className="glass p-8 md:p-12 rounded-[2.5rem] w-full shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 pb-6 border-b border-gray-200/50">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <div className="flex justify-center md:justify-start items-center gap-3 mb-3">
                            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-md">
                                <Activity className="text-white" size={24} />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                        </div>
                        <p className="text-gray-500 text-lg">Join RaktSetu to donate and request help.</p>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-500 mb-1">Already have an account?</p>
                        <Link to="/auth/login" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-800 transition-colors">
                            Sign in instead <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="email" name="email" value={formData.email} onChange={handleChange} required
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="password" name="password" value={formData.password} onChange={handleChange} required
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                        placeholder="Create a strong password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                        placeholder="+91 XXXXXXXXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                        </div>
                                        <input 
                                            type="text" name="city" value={formData.city} onChange={handleChange} required
                                            className="block w-full pl-10 pr-3 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                                    <input 
                                        type="text" name="pincode" value={formData.pincode} onChange={handleChange} required
                                        className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                        placeholder="400001"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Droplets size={20} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
                                    </div>
                                    <select 
                                        name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm appearance-none"
                                    >
                                        <option value="" disabled>Select your blood group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                    {/* Custom Dropdown Arrow */}
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Calendar size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="date" name="dob" value={formData.dob} onChange={handleChange} required
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center items-center gap-2 py-4 px-4 text-white rounded-2xl font-bold text-lg transition-all shadow-xl mt-2 ${
                                        loading
                                        ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transform active:scale-[0.98] shadow-primary-500/25'
                                    }`}
                                >
                                    {loading ? 'Creating Account...' : 'Complete Registration'}
                                </button>
                                
                                {error && (
                                    <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
                
                <div className="mt-8 text-center md:hidden border-t border-gray-200/50 pt-6">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="font-bold text-primary-600 hover:text-primary-800 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
          </motion.div>
      </div>
    </div>
  );
};

export default Register;
