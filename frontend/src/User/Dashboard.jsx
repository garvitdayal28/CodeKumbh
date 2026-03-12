import React from 'react';
import { Search, Plus, CreditCard, Activity, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DonorCard from './components/DonorCard';
import EmergencyRequest from './components/EmergencyRequest';
import useAuthStore from '../store/useAuthStore';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-screen bg-background-light transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-14">
          <div>
            <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
              Welcome back, <span className="text-primary-600">{user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Patient'}</span>
            </h2>
            <p className="text-slate-500 font-medium mt-1">Manage your healthcare appointments and life-saving contributions.</p>
          </div>
          <div className="flex items-center gap-4">
            {user?.bloodGroup && (
               <div className="flex flex-col items-center bg-white border border-slate-200 px-6 py-2 rounded-2xl shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Blood Group</span>
                  <span className="text-2xl font-black text-primary-600 leading-none">{user.bloodGroup}</span>
               </div>
            )}
            <button className="flex items-center gap-2 px-6 py-4 bg-primary-500 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20 hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest">
              <Plus size={20} />
              New Record
            </button>
          </div>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-primary-50 rounded-2xl text-primary-600 border border-primary-100">
              <Activity size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            {/* Book Appointment Card */}
            <motion.div 
               whileHover={{ y: -5 }}
               onClick={() => navigate('/user/book-appointment')}
               className="group relative overflow-hidden bg-white rounded-[2.5rem] p-1 border border-slate-100 shadow-xl cursor-pointer"
            >
               <div className="absolute inset-0 bg-linear-to-br from-primary-600 to-red-700"></div>
               <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
               
               <div className="relative p-10 h-full flex flex-col items-start min-h-[280px]">
                  <div className="mb-6 p-4 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30">
                     <Plus size={32} className="stroke-[3px]" />
                  </div>
                  <h4 className="text-4xl font-black mb-3 leading-tight tracking-tight">Book an <br/>Appointment</h4>
                  <p className="text-white/80 font-medium mb-auto text-lg">Secure your slot with our healthcare experts today.</p>
                  
                  <div className="mt-8 flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-2xl font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                     Book Now <ArrowRight size={18} />
                  </div>
               </div>
            </motion.div>

            {/* Become a Donor Card */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="group relative overflow-hidden bg-white rounded-[2.5rem] p-1 border border-slate-100 shadow-xl cursor-not-allowed"
            >
               <div className="absolute inset-0 bg-slate-900"></div>
               <div className="absolute inset-0 bg-linear-to-tr from-primary-600/20 to-transparent"></div>
               
               <div className="relative p-10 h-full flex flex-col items-start min-h-[280px]">
                  <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                     <CreditCard size={32} className="stroke-[3px]" />
                  </div>
                  <h4 className="text-4xl font-black mb-3 leading-tight tracking-tight">Become a <br/>Lifesaver</h4>
                  <p className="text-slate-400 font-medium mb-auto text-lg">Register as a blood or organ donor and save lives.</p>
                  
                  <div className="mt-8 flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                     Register Now <ArrowRight size={18} />
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Emergency Requests Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-xl text-red-600">
                <Activity size={24} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Emergency Requests in <span className="text-red-600">{user?.city || 'Delhi'}</span>
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs text-red-600 font-black uppercase tracking-widest">3 Live Requests</span>
            </div>
          </div>
          
          <div className="grid gap-4">
            <EmergencyRequest 
              hospital="AIIMS Trauma Centre"
              locality="Ansari Nagar East, Delhi"
              distance="2.4 km"
              urgency="Critical"
              bloodGroup="B+"
              type="Whole Blood"
              units="3"
              timeAgo="15 mins ago"
              variant="critical"
            />
            <EmergencyRequest 
              hospital="Fortis Escorts Heart Institute"
              locality="Okhla Road, Delhi"
              distance="5.1 km"
              urgency="Urgent"
              bloodGroup="O-"
              type="Platelets"
              units="2"
              timeAgo="45 mins ago"
              variant="urgent"
            />
          </div>

          <div className="mt-12">
            <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-3xl hover:bg-slate-50 hover:border-primary-300 hover:text-primary-600 transition-all shadow-sm group mx-auto text-xs uppercase tracking-widest">
              View All Emergency Requests
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
