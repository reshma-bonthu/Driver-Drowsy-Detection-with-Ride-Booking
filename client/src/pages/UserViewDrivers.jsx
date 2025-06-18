import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";

const UserViewDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: "", phone: "" });
  const [sortOrder, setSortOrder] = useState("place-asc");
  const [filterText, setFilterText] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const COLORS = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71"];

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value,
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
          {`Count: ${value}`}
        </text>
        <text
          x={mx + (cos >= 0 ? 1 : -1) * 12}
          y={my}
          dy={18}
          textAnchor={cos >= 0 ? "start" : "end"}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || { name: "", phone: "" };
    setCurrentUser(user);
    axios
      .get("https://driver-drowsy-detection-with-ride-booking.onrender.com/api/driver")
      .then((res) => {
        setDrivers(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch drivers", err);
      });
  }, []);

  const sortedDrivers = [...drivers].sort((a, b) => {
    if (sortOrder.startsWith("place")) {
      const placeA = a.place.toLowerCase();
      const placeB = b.place.toLowerCase();
      return sortOrder === "place-asc"
        ? placeA.localeCompare(placeB)
        : placeB.localeCompare(placeA);
    } else if (sortOrder.startsWith("accuracy")) {
      const getAccuracy = (driver) => {
        const total = (driver.sleepy ?? 0) + (driver.yawn ?? 0) + (driver.drowsy ?? 0) + (driver.active ?? 0);
        return total > 0 ? (driver.active / total) * 100 : 0;
      };
      const accA = getAccuracy(a);
      const accB = getAccuracy(b);
      return sortOrder === "accuracy-asc" ? accA - accB : accB - accA;
    }
    return 0;
  });

  const filteredDrivers = sortedDrivers.filter((driver) =>
    driver.place.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleBookNow = async (phone, driverUsername) => {
    const bookedByName = currentUser.name;
    const bookedByPhone = currentUser.phone;

    try {
      await axios.post("https://driver-drowsy-detection-with-ride-booking.onrender.com/api/book/book-now", {
        phone,
        driverUsername,
        bookedByName,
        bookedByPhone,
      });
      alert("Booking message sent!");
    } catch (err) {
      console.error("Message error:", err);
      alert("Failed to send message.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-brandOrange p-6 pt-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-black text-center md:text-left mb-4 md:mb-0">
          Hello {currentUser.name || "User"}, choose your ride
        </h1>

        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search by place..."
            className="px-3 py-2 border rounded placeholder-black text-black"
          />

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 bg-white text-black border border-gray-300 rounded appearance-none"
            >
              <option value="place-asc">Sort by Place: Ascending</option>
              <option value="place-desc">Sort by Place: Descending</option>
              <option value="accuracy-asc">Sort by Accuracy: Ascending</option>
              <option value="accuracy-desc">Sort by Accuracy: Descending</option>
            </select>
            <div className="absolute top-3 right-3 pointer-events-none">
              {sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredDrivers.map((driver, index) => {
          const data = [
            { name: "Sleepy", value: driver.sleepy ?? 0 },
            { name: "Yawn", value: driver.yawn ?? 0 },
            { name: "Drowsy", value: driver.drowsy ?? 0 },
            { name: "Active", value: driver.active ?? 0 },
          ];

          const total = data.reduce((sum, d) => sum + d.value, 0);
          const accuracy = total > 0 ? ((driver.active / total) * 100).toFixed(2) : "0.00";

          return (
            <div
              key={index}
              className="bg-black text-white rounded-xl shadow-md p-4 flex flex-col md:flex-row items-center justify-between"
            >
              <div className="flex flex-col items-center w-full md:w-1/3 mb-4 md:mb-0 space-y-2">
                <img
                  src={`https://driver-drowsy-detection-with-ride-booking.onrender.com/${driver.profilePicture}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <p className="text-lg font-semibold">{driver.username}</p>
                <button
                  onClick={() => handleBookNow(driver.phone, driver.username)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Book Now
                </button>
              </div>

              <div className="text-center w-full md:w-1/3 mb-4 md:mb-0">
                <p><strong>Full Name:</strong> {driver.fullName}</p>
                <p><strong>Email:</strong> {driver.email}</p>
                <p><strong>Place:</strong> {driver.place}</p>
                <p><strong>Phone:</strong> {driver.phone}</p>
                <p><strong>Accuracy:</strong> {accuracy}%</p>
              </div>

              <div
                className="bg-black p-4 rounded-lg shadow-md max-h-[300px] w-[396px] transition-all duration-300"
                onMouseEnter={() => setShowChart(true)}
                onMouseLeave={() => setShowChart(false)}
              >
                <h3 className="text-xl font-bold mb-3 -mt-3 ml-11">Driver Detection Summary</h3>
                <div className="w-full h-60">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={data}
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
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserViewDrivers;
