import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";

import "../App.css";

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const COLORS = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71"];

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 15}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}`} stroke={fill} fill="none" />
        <circle cx={mx} cy={my} r={2} fill={fill} stroke="none" />
        <text
          x={mx + (cos >= 0 ? 1 : -1) * 12}
          y={my}
          textAnchor={cos >= 0 ? "start" : "end"}
          fill="#999"
        >
          Count: {value}
        </text>
        <text
          x={mx + (cos >= 0 ? 1 : -1) * 12}
          y={my}
          dy={18}
          textAnchor={cos >= 0 ? "start" : "end"}
          fill="#999"
        >
          ({(percent * 100).toFixed(2)}%)
        </text>
      </g>
    );
  };

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setDriver(user);
      setFormData(user);

      fetch(`http://localhost:5000/api/detections/${user.id}`)
        .then((res) => res.json())
        .then((stats) => {
          setDriver((prev) => ({ ...prev, ...stats }));
        })
        .catch((err) => console.error("Failed to fetch stats", err));

      fetch(`http://localhost:5000/api/sessions/tripCount/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Trip Count API response:", data);
          setDriver((prev) => ({ ...prev, tripCount: data.tripCount }));
        })
        .catch((err) => console.error("Failed to fetch trip count", err));

      fetch(`http://localhost:5000/api/sessions/timelines/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.timelines && Array.isArray(data.timelines)) {
            const formatted = data.timelines.map((t) =>
              new Date(t).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            );
            setTimeline(formatted);
          } else {
            console.warn("No timelines found in response", data);
            setTimeline([]);
          }
        })
        .catch((err) => console.error("Failed to fetch timeline", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await fetch(
        `http://localhost:5000/api/driver/update/${driver.id}`,
        {
          method: "PUT",
          body: data,
        }
      );
      const updatedRes = await res.json();
      const updated = {
        ...updatedRes.driver,
        id: updatedRes.driver._id,
      };
      localStorage.setItem("user", JSON.stringify(updated));
      setDriver(updated);
      setEditMode(false);
    } catch (err) {
      console.log(
        `Sending update to: http://localhost:5000/api/driver/update/${driver.id}`
      );
      alert("Update failed");
    }
  };

  if (!driver) return <p className="text-center mt-10">Loading profile...</p>;

  const data = [
    { name: "Sleepy", value: driver.sleepy ?? 0 },
    { name: "Yawn", value: driver.yawn ?? 0 },
    { name: "Drowsy", value: driver.drowsy ?? 0 },
    { name: "Active", value: driver.active ?? 0 },
  ];

  const total =
    (driver.sleepy ?? 0) +
    (driver.yawn ?? 0) +
    (driver.drowsy ?? 0) +
    (driver.active ?? 0);
  const accuracy =
    total > 0 ? ((driver.active / total) * 100).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-brandOrange flex items-center justify-center p-6 pt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full">
        {/* Profile Section */}
        <div className="bg-black text-white p-6 rounded-2xl shadow-2xl flex flex-col items-center min-h-[300px]">
          <div className="relative w-36 h-36 mb-6">
            <img
              src={
                driver.profilePicture
                  ? `http://localhost:5000/${driver.profilePicture.replace(/\\/g, "/")}`
                  : "/default-profile.png"
              }
              alt="Driver"
              className="w-full h-full rounded-full object-cover"
            />
            {editMode && (
              <>
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md hover:bg-gray-100"
                  title="Edit Profile Picture"
                  style={{
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-black"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path
                      fillRule="evenodd"
                      d="M2 16a2 2 0 002 2h12a2 2 0 002-2v-7a1 1 0 10-2 0v7H4v-7a1 1 0 10-2 0v7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
                <input
                  id="profilePicture"
                  type="file"
                  name="profilePicture"
                  onChange={handleChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          {editMode ? (
            <form
              onSubmit={handleUpdate}
              className="w-full max-w-sm space-y-3"
              encType="multipart/form-data"
            >
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="Place"
                className="w-full p-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-green-500 px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">
                {driver.fullName || "No name"}
              </h2>
              <p className="text-sm text-gray-300">
                {driver.place || "No place provided"}
              </p>
              <div className="mt-6 space-y-2 text-center text-base">
                <p>📞 {driver.phone || "No phone provided"}</p>
                <p>✉ {driver.email || "No email provided"}</p>
                <p>
                  🔓 SMS Alerts: <span className="text-green-400">Active</span>
                </p>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Info Sections */}
        <div className="space-y-6">
          {/* Detection Summary */}
          <div
            className="bg-black text-white p-10 rounded-2xl shadow-2xl max-h-[1000px] transition-all duration-300"
            onMouseEnter={() => setShowChart(true)}
            onMouseLeave={() => setShowChart(false)}
          >
            <h3 className="text-xl font-bold mb-3 -mt-3">
              Driver Detection Summary
            </h3>

            {showChart ? (
              <div className="w-full h-60">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      label={false}
                      labelLine={false}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-3 text-lg">
                <div>
                  😴 <strong>Sleepy:</strong> {driver.sleepy ?? 0}
                </div>
                <div>
                  😮 <strong>Yawn:</strong> {driver.yawn ?? 0}
                </div>
                <div>
                  💤 <strong>Drowsy:</strong> {driver.drowsy ?? 0}
                </div>
                <div>
                  ✅ <strong>Active:</strong> {driver.active ?? 0}
                </div>
                <div>
                  🛣 <strong>Trips:</strong> {driver.tripCount ?? 0}
                </div>
                <div>
                  📊 <strong>Accuracy:</strong> {accuracy}%
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-black p-6 rounded-xl shadow-md max-h-60 overflow-y-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              Detection Timeline
            </h3>
            <ul className="space-y-3 text-white text-base">
              {timeline.length > 0 ? (
                timeline.map((time, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-400 mr-3 flex-shrink-0"></span>
                    <span className="break-words">{time}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No detections available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
