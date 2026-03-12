import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Droplets, Calendar, ArrowRight, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user'); // 'user' or 'doctor'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    pincode: '',
    bloodGroup: '',
    dob: '',
    // Doctor specific fields
    specialization: '',
    medicalRegNumber: '',
    hospitalName: '',
    hospitalId: '',
    department: ''
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

    // Sanitize phone number to E.164 format (Indian only: +91 + 10 digits)
    const rawPhone = formData.phone.replace(/\D/g, '');
    if (rawPhone.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        setLoading(false);
        return;
    }
    const sanitizedPhone = '+91' + rawPhone;

    try {
        const endpoint = role === 'user' 
            ? 'http://localhost:5000/api/auth/register' 
            : 'http://localhost:5000/api/auth/doctor-register';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...formData, phone: sanitizedPhone })
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        console.log('Registration successful', data);
        
        // Save to Zustand store
        useAuthStore.getState().setAuth({ ...formData, uid: data.uid, role: data.role, status: data.account_status }, null);
        
        // Redirection after registration
        if (role === 'doctor') {
            // Doctors might need to wait for approval, but for now redirecting as requested
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
      
      {/* Background blurs */}
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
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-200/50">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <div className="flex justify-center md:justify-start items-center gap-3 mb-3">
                            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-md">
                                <Activity className="text-white" size={24} />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                        </div>
                        <p className="text-gray-500 text-lg">Join RaktSetu to donate and request help.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 mb-1">Already have an account?</p>
                        <Link to="/auth/login" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-800 transition-colors">
                            Sign in instead <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Role Selection */}
                <div className="flex justify-center mb-10">
                    <div className="bg-gray-100/50 p-1.5 rounded-2xl flex gap-2 border border-gray-200">
                        <button 
                            onClick={() => setRole('user')}
                            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${role === 'user' ? 'bg-white shadow-md text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            I'm a User / Donor
                        </button>
                        <button 
                            onClick={() => setRole('doctor')}
                            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${role === 'doctor' ? 'bg-white shadow-md text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            I'm a Doctor
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Common Fields */}
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
                                        placeholder="Alex"
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
                                        placeholder="test@gmail.com"
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
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <div className="flex bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500 transition-all shadow-sm overflow-hidden">
                                        <span className="flex items-center pl-12 pr-2 text-gray-500 font-bold border-r border-gray-200 py-3.5 bg-gray-100/30">+91</span>
                                        <input 
                                            type="tel" name="phone" value={formData.phone} onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFormData({ ...formData, phone: val });
                                            }} required
                                            className="block w-full px-4 py-3.5 bg-transparent border-none outline-none text-gray-900"
                                            placeholder="9406639268"
                                        />
                                    </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-400 ml-1">Indian numbers only (10 digits)</p>
                            </div>
                        </div>

                        {/* Role Specific Fields */}
                        <div className="space-y-6">
                            {role === 'user' ? (
                                <>
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
                                                    placeholder="Jabalpur"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                                            <input 
                                                type="text" name="pincode" value={formData.pincode} onChange={handleChange} required
                                                className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                                placeholder="482001"
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
                                                <option value="" disabled>Select blood group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
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
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                                            <input 
                                                type="text" name="specialization" value={formData.specialization} onChange={handleChange} required
                                                className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                                placeholder="Cardiologist"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Registration No.</label>
                                            <input 
                                                type="text" name="medicalRegNumber" value={formData.medicalRegNumber} onChange={handleChange} required
                                                className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                                placeholder="REG123456"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Name</label>
                                        <input 
                                            type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required
                                            className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                            placeholder="AIIMS"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Code</label>
                                            <input 
                                                type="text" name="hospitalId" value={formData.hospitalId} onChange={handleChange} required
                                                className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                                placeholder="AIIMS-DEL-001"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                            <input 
                                                type="text" name="department" value={formData.department} onChange={handleChange} required
                                                className="block w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                                                placeholder="OPD"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

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
                                    {loading ? 'Processing...' : (role === 'user' ? 'Complete Registration' : 'Register for Approval')}
                                </button>
                                
                                {error && (
                                    <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                                        {error || 'Failed to fetch'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
          </motion.div>
      </div>
    </div>
  );
};

export default Register;
