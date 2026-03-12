import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import AdminRegister from './auth/AdminRegister'
import Dashboard from './User/Dashboard'
import BookAppointment from './User/BookAppointment'
import Profile from './User/Profile'
import Queue from './User/Queue'
import AdminDashboard from './Admin/Dashboard'
import Hospitals from './Admin/Hospitals'
import DoctorRequests from './Admin/DoctorRequests'
import DoctorDashboard from './Doctor/Dashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/admin-register" element={<AdminRegister />} />
      
      {/* Role-based Dashboard Routes */}
      <Route path="/user/dashboard" element={<Dashboard />} />
      <Route path="/user/book-appointment" element={<BookAppointment />} />
      <Route path="/user/profile" element={<Profile />} />
      <Route path="/user/queue" element={<Queue />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/hospitals" element={<Hospitals />} />
      <Route path="/admin/doctor-requests" element={<DoctorRequests />} />
      
      {/* Fallback/Legacy route */}
      <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
    </Routes>
  )
}

export default App