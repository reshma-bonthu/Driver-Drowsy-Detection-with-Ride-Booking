import React, { useEffect, useState } from "react";

const AllDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch("https://driver-drowsy-detection-with-ride-booking.onrender.com/api/driver/");
        const data = await res.json();
        setDrivers(data);
      } catch (err) {
        console.error("Failed to fetch drivers", err);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div style={{ backgroundColor: "#FFD700", padding: "20px", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>All Driver Profiles</h2>
      {drivers.map((driver) => (
        <div
          key={driver._id}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Profile picture and username */}
          <div style={{ flex: 1 }}>
            <img
              src={`http://localhost:5000/${driver.profilePicture}`}
              alt="Profile"
              style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
            />
            <h3>{driver.username}</h3>
          </div>

          {/* Center: Personal details */}
          <div style={{ flex: 2 }}>
            <p><strong>Full Name:</strong> {driver.fullName}</p>
            <p><strong>Email:</strong> {driver.email}</p>
            <p><strong>Phone:</strong> {driver.phone}</p>
            <p><strong>Place:</strong> {driver.place}</p>
          </div>

          {/* Right: Reserved for graph or metrics */}
          <div style={{ flex: 1 }}>
            {/* Placeholder for future graph */}
            <p style={{ textAlign: "center" }}>📊 Graph coming soon</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllDrivers;
