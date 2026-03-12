import React from 'react';
import { Search, Plus, CreditCard, Activity, ArrowRight, MapPin } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DonorCard from './components/DonorCard';
import EmergencyRequest from './components/EmergencyRequest';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-screen bg-background-light transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-14">
          <div>
            <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
              Welcome back, <span className="text-primary-600">{user?.name?.split(' ')[0] || 'Donor'}</span>
            </h2>
            <p className="text-slate-500 font-medium mt-1">Manage your life-saving contributions and active alerts.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-primary-500 hover:border-primary-100 transition-all shadow-sm">
              <Search size={20} />
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20 hover:bg-primary-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest">
              <Plus size={20} />
              New Entry
            </button>
          </div>
        </header>

        {/* My Donor Profile Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-50 rounded-2xl text-primary-600 border border-primary-100">
                <CreditCard size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">My Donor Profile</h3>
            </div>
            <button className="text-primary-600 text-xs font-black hover:text-primary-700 transition-colors uppercase tracking-widest px-4 py-2 hover:bg-primary-50 rounded-xl transition-all">
              Edit Profile
            </button>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <DonorCard 
              type="Blood Donor"
              eligibility="Eligible to Donate"
              bloodGroup={user?.blood_group || user?.bloodGroup || 'Select Blood Group'}
              lastDonation="12 Oct 2023"
              isBloodDonor={true}
            />
            <DonorCard 
              type="Organ Donor"
              status="Verified Pledger"
              organs={['Kidney', 'Liver']}
              isBloodDonor={false}
            />
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
