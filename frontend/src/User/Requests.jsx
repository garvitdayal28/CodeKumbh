import React, { useState, useEffect } from 'react';
import { Plus, Droplet, Phone, Mail, MapPin, Clock, User as UserIcon, AlertCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';

const Requests = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    units: 1,
    urgency: 'Normal',
    hospitalName: '',
    reason: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/blood-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/blood-requests', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Blood request created successfully!');
      setShowModal(false);
      setFormData({ bloodGroup: '', units: 1, urgency: 'Normal', hospitalName: '', reason: '' });
      fetchRequests();
    } catch (error) {
      console.error('Error creating request:', error);
      alert(error.response?.data?.message || 'Failed to create blood request');
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-background-light">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-14">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Blood Requests</h2>
            <p className="text-slate-500 font-medium mt-1">Request blood or help others in need</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-4 bg-primary-500 text-white rounded-2xl font-black shadow-lg hover:bg-primary-600 transition-all"
          >
            <Plus size={20} />
            New Request
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-50 rounded-2xl">
                      <Droplet size={24} className="text-red-500 fill-current" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{request.bloodGroup}</h3>
                      <p className="text-sm text-slate-500 font-medium">{request.units} unit(s) needed</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl font-bold text-xs uppercase ${
                    request.urgency === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'
                  }`}>
                    {request.urgency}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <UserIcon size={16} />
                    <span className="font-medium">{request.requesterName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} />
                    <span className="font-medium">{request.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={16} />
                    <span className="font-medium">{request.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} />
                    <span className="font-medium">{request.hospitalName}</span>
                  </div>
                  {request.reason && (
                    <div className="flex items-start gap-2 text-slate-600">
                      <AlertCircle size={16} className="mt-1" />
                      <span className="font-medium">{request.reason}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock size={14} />
                    <span>{new Date(request.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {request.requesterId !== user?.uid && (
                  <a 
                    href={`tel:${request.phone}`}
                    className="block w-full text-center px-6 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all"
                  >
                    Contact Now
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-black text-slate-900 mb-6">Create Blood Request</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group</label>
                  <select 
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none text-slate-900 bg-white"
                    required
                  >
                    <option value="" className="text-slate-400">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg} className="text-slate-900">{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Units Needed</label>
                  <input 
                    type="number"
                    min="1"
                    value={formData.units}
                    onChange={(e) => setFormData({...formData, units: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none text-slate-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Urgency</label>
                  <select 
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none text-slate-900 bg-white"
                  >
                    <option value="Normal" className="text-slate-900">Normal</option>
                    <option value="Urgent" className="text-slate-900">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Hospital Name</label>
                  <input 
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none text-slate-900 bg-white"
                    placeholder="Enter hospital name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Reason (Optional)</label>
                  <textarea 
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none text-slate-900 bg-white"
                    placeholder="Enter reason for blood request"
                    rows="3"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-all"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </>
  );
};

export default Requests;
