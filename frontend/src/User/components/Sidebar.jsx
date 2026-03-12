import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  User, 
  ListOrdered, 
  History, 
  Home, 
  Bell, 
  LogOut, 
  Droplets,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { name: 'Profile', path: '/user/dashboard', icon: User },
    { name: 'Queue', path: '/user/queue', icon: ListOrdered },
    { name: 'History', path: '/user/history', icon: History },
    { name: 'Home', path: '/', icon: Home },
    { name: 'Requests', path: '/user/requests', icon: Bell },
  ];

  return (
    <aside className="w-64 bg-white text-slate-600 h-screen fixed left-0 top-0 flex flex-col border-r border-slate-100 z-50">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Droplets size={24} className="text-white fill-current" />
          </div>
          <div>
            <h1 className="text-slate-900 font-black text-xl tracking-tighter uppercase">RAKTSETU</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">User Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-primary-50 text-primary-600 border border-primary-100/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={`transition-transform group-hover:scale-110 ${isActive ? 'fill-current' : ''}`} />
                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-50">
        <div className="bg-slate-50/50 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-500 font-bold border border-slate-200">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-slate-900 font-bold text-sm truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate font-medium">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-xs font-bold border border-slate-200 hover:border-red-200 shadow-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
