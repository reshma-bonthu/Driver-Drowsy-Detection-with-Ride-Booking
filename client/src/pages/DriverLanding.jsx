import React, { useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import DriverProfile from './DriverProfile';


const DriverLanding = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [userName, setUserName] = useState('');
  const [driver, setDriver] = useState({});
  const [refreshDriver, setRefreshDriver] = useState(false);
  const navigate = useNavigate();
    useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setDriver(user);
  
      // Fetch detection stats and merge them into the driver state
      fetch(`https://driver-drowsy-detection-with-ride-booking.onrender.com/api/driver/${user.id}`)
        .then((res) => res.json())
        .then((stats) => {
          setDriver((prev) => ({ ...prev, ...stats }));
        })
        .catch((err) => console.error("Failed to fetch stats", err));
  
  
       
    }
  }, [refreshDriver]);

  const handleLogout = () => {
    localStorage.removeItem('user'); // clear user data
    navigate('/'); // redirect to RoleSelection page
  };

  const handleStartDetection = async () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) {
      console.error("User not logged in");
      return;
    }
    const userObj = JSON.parse(user);
    const driverid = userObj.id;

    const url = http://localhost:5000/start-detection?driverId=${encodeURIComponent(driverId)};
  window.open(url, "_blank");
};



  return showProfile ? (
    <>
      <button
  className="absolute top-4 left-4  bg-black text-white px-3 py-1 text-sm rounded-md font-semibold shadow-sm hover:bg-gray-200 transition z-50 whitespace-nowrap"
  onClick={() =>{ setShowProfile(false); setRefreshDriver(prev => !prev);} }
>
  Back
</button>

      <DriverProfile />
    </>
  ) : (
    <div className="min-h-screen bg-brandOrange flex items-center justify-center p-6">
      <div className="w-full max-w-7xl">
        {/* Main heading */}
        <h6 className="text-center text-3xl font-bold text-black mb-4 mt-0">
            Hello {driver?.fullName || "Driver"}
        </h6>

        {/* Banner container */}
        <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
          {/* Left image */}
          <div className="relative w-full md:w-1/2 overflow-hidden">
            <img
              src="/car2.jpg "
              alt="Person working"
              className="w-full h-full object-cover"
            />
            {/* Slanted divider */}
            <div className="absolute top-0 right-0 h-full w-2 bg-brandOrange rotate-4 transform origin-left z-9" />
          </div>

          {/* Right content */}
          <div className="w-full md:w-1/2 p-8 text-white relative z-10 flex flex-col justify-between">
              {/* Top Nav with logout */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-6 text-sm flex-wrap">
                <span>Home</span>
                <span>About</span>
              </div>
              <span
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold transition"
              >
                Logout
              </span>
            </div>


            {/* Centered Text */}
            <div className="flex flex-col gap-6 items-center justify-center flex-grow">
              <h2 className="text-3xl font-extrabold font-serif italic text-orange-400">
                "Drive Safe, Drive Smart."
              </h2>
              <button
                className="bg-brandOrange text-black px-6 py-3 rounded-lg text-lg font-semibold w-3/4 flex items-center justify-center"
                onClick={handleStartDetection}
              >
                Start Detecting
              </button>

              <button
                className="bg-brandOrange text-black px-6 py-3 rounded-lg text-lg font-semibold w-3/4 flex items-center justify-center"
                onClick={() => setShowProfile(true)}
              >
                Profile
              </button>
            </div>

            {/* Bottom icons */}
            <div className="flex items-center gap-4 mt-8">
              <span className="ml-auto text-sm"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLanding;
