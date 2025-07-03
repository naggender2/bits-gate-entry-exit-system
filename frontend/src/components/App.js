import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import VisitorForm from './VisitorForm';
import ExitByContact from './ExitByContact';
import ExitById from './ExitById';
import ExitByVehicle from './ExitByVehicle';
import ExitByQr from './ExitByQr';
import VisitorsTable from './VisitorsTable';
import InsideVisitors from './InsideVisitors';
import LoginPage from './LoginPage';
import AdminInsideVisitors from './AdminInsideVisitors';
import AdminVisitorsTable from './AdminVisitorsTable';
import AdminPanel from './AdminPanel';
import ResetPassword from './ResetPassword';
import GuardActivityTable from './GuardActivityTable'; // Import the Guard Activity Table component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    return storedLoginStatus === 'true';
  });

  const [role, setRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role || null; // Retrieve role from localStorage
  });

  const [ipAddress, setIpAddress] = useState('');

  // // Fetch the user's public IPv4 address
  // useEffect(() => {
  //   const fetchIpAddress = async () => {
  //     try {
  //       const response = await fetch('https://ipinfo.io/json?token=167b86b191d60d'); // Replace with your token
  //       const data = await response.json();
  //       setIpAddress(data.ip); // Set IPv4 address
  //       localStorage.setItem('ipAddress', data.ip); // Persist IP address
  //     } catch (error) {
  //       console.error('Failed to fetch IPv4 address:', error);
  //     }
  //   };

  //   fetchIpAddress();
  // }, []);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://checkip.amazonaws.com');
        const ip = await response.text(); // Directly returns the IP address as text
        setIpAddress(ip.trim()); // Remove any extra whitespace
        localStorage.setItem('ipAddress', ip.trim()); // Persist IP address
      } catch (error) {
        console.error('Failed to fetch IPv4 address:', error);
      }
    };
  
    fetchIpAddress();
  }, []);
  
  

  const handleLogin = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
    localStorage.setItem('isLoggedIn', 'true'); // Persist login status
    localStorage.setItem('user', JSON.stringify({ role: userRole })); // Persist user role
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    localStorage.clear(); // Clear all localStorage data
    window.location.href = '/'; // Redirect to login page
  };

  // Wrapper for protected routes based on authentication and roles
  const ProtectedRoute = ({ allowedRoles, children }) => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      return <Navigate to="/" />;
    }
    if (!allowedRoles.includes(role)) {
      // Redirect to default panel if unauthorized
      return role === 'admin' ? <Navigate to="/admin-panel" /> : <Navigate to="/guard-panel" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

        {/* Guard Routes */}
        <Route
          path="/guard-panel"
          element={
            <ProtectedRoute allowedRoles={['guard']}>
              <Home onLogout={handleLogout} ipAddress={ipAddress} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor-details"
          element={
            <ProtectedRoute allowedRoles={['guard']}>
              <VisitorForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exit-contact"
          element={
            <ProtectedRoute allowedRoles={['guard']}>
              <ExitByContact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exit-vehicle"
          element={
            <ProtectedRoute allowedRoles={['guard']}>
              <ExitByVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exit-id"
          element={
            <ProtectedRoute allowedRoles={['guard']}>
              <ExitById />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exit-qr"
          element={
            <ProtectedRoute allowedRoles={['guard']}>
              <ExitByQr />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitors"
          element={
            <ProtectedRoute allowedRoles={['guard']}>
              <VisitorsTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inside-visitors"
          element={
            <ProtectedRoute allowedRoles={['guard']}>
              <InsideVisitors />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-inside-visitors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminInsideVisitors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-visitors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminVisitorsTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel onLogout={handleLogout} ipAddress={ipAddress} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ResetPassword />
            </ProtectedRoute>
          }  
        />        
        <Route
          path="/guard-activity"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GuardActivityTable />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
