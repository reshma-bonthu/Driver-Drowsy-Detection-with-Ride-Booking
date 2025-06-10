import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoleSelectionPage from './pages/RoleSelectionPage';
import UserLogin from './pages/UserLogin';
import DriverLogin from './pages/DriverLogin';
import DriverLanding from './pages/DriverLanding';
import DriverProfile from './pages/DriverProfile';
import UserViewDrivers from './pages/UserViewDrivers';
import AllDrivers from "./pages/AllDriver";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/driver" element={<DriverLogin />} />
        <Route path="/driver/landing" element={<DriverLanding />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/all-drivers" element={<AllDrivers />} />
        <Route path="/user/view-drivers" element={<UserViewDrivers />} />
      </Routes>
    </Router>
  );
}

export default App;
