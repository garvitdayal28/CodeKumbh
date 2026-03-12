import React, { useState } from 'react';
import { Heart, Calendar, ArrowRight, ShieldCheck, Activity, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import useAuthStore from '../store/useAuthStore';

const API_BASE = 'http://localhost:5000';

const Donation = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [lastDonation, setLastDonation] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingDonation, setIsLoggingDonation] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Calculate if eligible (90 days since last donation)
  const isEligible = () => {
    if (!user?.lastDonationDate) return true;
    const lastDate = new Date(user.lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 90;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreed) return;

    if (!user?.uid) {
      setErrorMsg('Unable to identify user. Please log in again.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          isBloodDonor: true,
          lastDonationDate: lastDonation || null
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register as donor');
      }

      if (data.user) {
        updateUser({
          ...data.user,
          bloodGroup: data.user.bloodGroup || data.user.blood_group || user?.bloodGroup || user?.blood_group
        });
      } else {
        updateUser({
          isBloodDonor: true,
          lastDonationDate: lastDonation || null
        });
      }

      setSuccessMsg('You are now registered as a blood donor.');
    } catch (error) {
      setErrorMsg(error.message || 'Failed to register as donor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogDonation = async () => {
    if (!user?.uid) {
      setErrorMsg('Unable to identify user. Please log in again.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsLoggingDonation(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const newDonation = {
        id: Date.now().toString(),
        date: today,
        location: user?.city || 'Not specified',
        units: 1,
        notes: 'Blood donation logged'
      };

      const updatedHistory = [...(user?.donationHistory || []), newDonation];

      const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          isBloodDonor: true,
          lastDonationDate: today,
          donationHistory: updatedHistory
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to log donation');
      }

      if (data.user) {
        updateUser({
          ...data.user,
          bloodGroup: data.user.bloodGroup || data.user.blood_group || user?.bloodGroup || user?.blood_group
        });
      } else {
        updateUser({
          isBloodDonor: true,
          lastDonationDate: today,
          donationHistory: updatedHistory
        });
      }

      setSuccessMsg('Donation logged successfully. Cooling period has started.');
    } catch (error) {
      setErrorMsg(error.message || 'Failed to log donation');
    } finally {
      setIsLoggingDonation(false);
    }
  };

  const RegistrationForm = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white rounded-3xl p-10 shadow-xl border border-slate-100"
    >
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-red-100">
          <Heart size={40} className="fill-current" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Become a Lifesaver</h3>
        <p className="text-slate-500 font-medium">Join our network of donors and help save lives in emergency situations.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Last Date of Donation (Optional)</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="date" 
              value={lastDonation}
              onChange={(e) => setLastDonation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-12 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium ml-1">Leave blank if you have never donated blood before.</p>
        </div>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex gap-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setAgreed(!agreed)}>
          <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-red-500 border-red-500' : 'bg-white border-slate-300'}`}>
            {agreed && <CheckCircle2 size={16} className="text-white" />}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">I consent to becoming a registered blood donor.</p>
            <p className="text-xs font-medium text-slate-500 mt-1">I agree to be contacted via email/SMS during blood emergencies in my city matching my blood group.</p>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!agreed || isSubmitting}
          className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg ${
            agreed 
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 active:scale-[0.98]' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isSubmitting ? 'Registering...' : 'Register as Donor'}
        </button>
      </form>
    </motion.div>
  );

  const DonorDashboard = () => (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Donor Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-1 shadow-2xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-red-900 to-red-950"></div>
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-red-600/30 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-[2.4rem] p-10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-white/10 rounded-full border border-white/20 flex flex-col items-center justify-center shadow-inner relative">
              <span className="text-xs font-black uppercase tracking-widest text-red-200 absolute top-4">Blood</span>
              <span className="text-5xl font-black text-white tracking-tighter mt-3">{user?.bloodGroup || user?.blood_group || 'O+'}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={28} className="text-red-400" />
                <h3 className="text-3xl font-black text-white tracking-tight">Registered Donor</h3>
              </div>
              <p className="text-red-200 font-medium text-lg">{user?.name || user?.fullName}</p>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/10">
                  <MapPin size={16} className="text-red-300" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">{user?.city || 'Delhi'}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-black uppercase tracking-widest ${isEligible() ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'}`}>
                  {isEligible() ? (
                    <>
                      <CheckCircle2 size={16} /> Eligible to Donate
                    </>
                  ) : (
                    <>
                      <Clock size={16} /> Cooling Period
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-2xl p-6 border border-white/5 text-center min-w-[200px]">
             <p className="text-[10px] font-black uppercase tracking-widest text-red-300/70 mb-2">Last Donated</p>
             <p className="text-2xl font-black text-white">{user?.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString('en-GB') : 'Never'}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className={`bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 group ${isLoggingDonation ? 'cursor-wait opacity-80' : 'cursor-pointer'}`}
          onClick={isLoggingDonation ? undefined : handleLogDonation}
        >
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <Activity size={32} />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mb-2">Log a Blood Donation</h4>
          <p className="text-slate-500 font-medium mb-6">Just donated blood? Log it here to start your 90-day cooling period tracker.</p>
          <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
            {isLoggingDonation ? 'Updating...' : 'Update Record'} <ArrowRight size={16} />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 cursor-not-allowed group"
        >
          <div className="w-16 h-16 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center mb-6">
            <MapPin size={32} />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mb-2">Nearby Blood Camps</h4>
          <p className="text-slate-500 font-medium mb-6">Find upcoming blood donation drives and camps in your city.</p>
          <div className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest">
            Coming Soon
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background-light font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-12 relative overflow-hidden">
        {/* Background Elements */}
        {!user?.isBloodDonor && (
          <>
            <div className="absolute top-[-10%] right-[-10%] w-160 h-160 bg-red-50/50 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-120 h-120 bg-slate-100/50 rounded-full blur-[80px] pointer-events-none"></div>
          </>
        )}

        <div className="relative z-10">
          <header className="mb-12">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Donation <span className="text-red-500">Network</span>
            </h2>
            <p className="text-slate-500 font-medium mt-2">View and manage your donation profiles.</p>
            {errorMsg && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {errorMsg}
              </p>
            )}
            {successMsg && (
              <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {successMsg}
              </p>
            )}
          </header>

          {user?.isBloodDonor ? <DonorDashboard /> : <RegistrationForm />}
        </div>
      </main>
    </div>
  );
};

export default Donation;
