import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Stethoscope, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2,
  Activity,
  User
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import useAuthStore from '../store/useAuthStore';

const BookAppointment = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    hospitalName: '',
    ward: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    priority: 'Normal'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mocking a successful booking
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Show success message
    }, 1500);
  };

  const wards = ['ENT', 'Dental', 'Cardiology', 'Orthopaedic', 'Neurology', 'Pediatrics', 'General OPD'];

  return (
    <div className="flex min-h-screen bg-[#FDF8F8] font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-[-10%] right-[-10%] w-160 h-160 bg-primary-100/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-120 h-120 bg-slate-200/50 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 flex items-center justify-between">
            <div>
              <button 
                onClick={() => navigate('/user/dashboard')}
                className="group flex items-center gap-2 text-slate-400 hover:text-primary-600 font-black text-xs uppercase tracking-widest transition-all mb-4"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Book <span className="text-primary-600">Appointment</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
                {[1, 2].map((s) => (
                    <div 
                        key={s} 
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${step === s ? 'bg-primary-500 w-8' : 'bg-slate-200'}`}
                    ></div>
                ))}
            </div>
          </header>

          {step < 3 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-primary-900/5 border border-white/40"
            >
              <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit}>
                {step === 1 ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Hospital Details */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary-50 rounded-xl text-primary-600 border border-primary-100">
                                <Building2 size={20} />
                            </div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Hospital Choice</h3>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Hospital Name</label>
                          <input 
                            type="text" 
                            name="hospitalName" 
                            value={formData.hospitalName} 
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-900 shadow-sm"
                            placeholder="e.g. AIIMS Delhi"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Department / Ward</label>
                          <select 
                            name="ward" 
                            value={formData.ward} 
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-slate-900 shadow-sm appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select Department</option>
                            {wards.map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Doctor Details */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary-50 rounded-xl text-primary-600 border border-primary-100">
                                <Stethoscope size={20} />
                            </div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Medical Professional</h3>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Doctor's Name (Optional)</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                <User size={18} />
                            </div>
                            <input 
                                type="text" 
                                name="doctorName" 
                                value={formData.doctorName} 
                                onChange={handleChange}
                                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-900 shadow-sm"
                                placeholder="Dr. Sharma"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Priority Level</label>
                          <div className="grid grid-cols-2 gap-3">
                              {['Normal', 'Urgent'].map(p => (
                                  <button 
                                    key={p}
                                    type="button"
                                    onClick={() => setFormData({...formData, priority: p})}
                                    className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${formData.priority === p ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20' : 'bg-white text-slate-400 border-slate-100 hover:border-primary-200'}`}
                                  >
                                      {p}
                                  </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full flex justify-center items-center gap-2 py-5 bg-slate-900 text-white rounded-3xl font-black text-lg shadow-2xl hover:bg-slate-800 transition-all group"
                    >
                      Next Step <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       {/* Schedule Details */}
                       <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-primary-50 rounded-xl text-primary-600 border border-primary-100">
                                <Activity size={20} />
                             </div>
                             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Appointment Timing</h3>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Preferred Date</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <input 
                                    type="date" 
                                    name="appointmentDate" 
                                    value={formData.appointmentDate} 
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-900 shadow-sm"
                                />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Preferred Time</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Clock size={18} />
                                </div>
                                <input 
                                    type="time" 
                                    name="appointmentTime" 
                                    value={formData.appointmentTime} 
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-900 shadow-sm"
                                />
                            </div>
                          </div>
                       </div>

                       {/* Additional Info */}
                       <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-primary-50 rounded-xl text-primary-600 border border-primary-100">
                                <CheckCircle2 size={20} />
                             </div>
                             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Reason for Visit</h3>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Description (Symptoms/Reason)</label>
                            <textarea 
                                name="reason" 
                                value={formData.reason} 
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full px-6 py-4 bg-white border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-900 shadow-sm resize-none"
                                placeholder="Describe your health concern..."
                            />
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-5 bg-white border border-slate-100 text-slate-600 rounded-3xl font-black text-lg hover:bg-slate-50 transition-all"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        disabled={loading}
                        className={`flex-2 py-5 text-white rounded-3xl font-black text-xl shadow-2xl transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 active:scale-[0.98] shadow-primary-500/20'}`}
                      >
                        {loading ? 'Confirming...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-16 rounded-[4rem] shadow-2xl text-center border border-slate-50"
            >
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle2 size={48} strokeWidth={3} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Booking Successful!</h3>
              <p className="text-slate-500 text-lg font-medium mb-12 max-w-md mx-auto leading-relaxed">
                Your appointment at <span className="text-slate-900 font-bold">{formData.hospitalName}</span> for <span className="text-slate-900 font-bold">{formData.ward}</span> has been scheduled for {formData.appointmentDate} at {formData.appointmentTime}.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/user/dashboard')}
                  className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Go to Dashboard
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="px-10 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Book Another
                </button>
              </div>
            </motion.div>
          )}

          {/* User Info Footnote */}
          <div className="mt-12 text-center p-6 bg-primary-50/50 rounded-3xl border border-primary-100/30">
            <p className="text-sm text-primary-700/80 font-bold tracking-tight">
              Booking for: <span className="text-primary-700 underline underline-offset-4 font-black">{user?.name || user?.fullName || 'Health Patient'}</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;
