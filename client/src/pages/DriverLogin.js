import React, { useState } from "react";
import "./login.css"; // Ensure the CSS handles scrolling
import { useNavigate } from 'react-router-dom';

const DriverLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    place: "",
    phone: "",
    profilePicture: null,
    aadhar: null,
    license: null,
    registration: null,
    insurance: null,
  });

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSignIn = async() => {
    const { username, password } = signInData;
    if (!username || !password) {
      return alert("Please enter both username and password");
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("Login successful");
        // You can now store user info in localStorage or state
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect or update UI here
        navigate('/driver/landing');

      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const handleSignUp = async () => {
    const {
      fullName,
      username,
      email,
      password,
      confirmPassword,
      place,
      phone,
      profilePicture,
      aadhar,
      license,
      registration,
      insurance,
      sleepy,
      drowsy,
      active,
      yawn
    } = signUpData;

      // Basic regex validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d).{6,}$/;
  
    const missingFields = [];
  
    if (!fullName) missingFields.push("Full Name");
    if (!username) missingFields.push("Username");
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");
    if (!confirmPassword) missingFields.push("Confirm Password");
    if (!place) missingFields.push("Place");
    if (!phone) missingFields.push("Phone Number");
    if (!profilePicture) missingFields.push("Profile Picture");
    if (!aadhar) missingFields.push("Aadhar");
    if (!license) missingFields.push("Driving License");
    if (!registration) missingFields.push("Registration Certificate");
    if (!insurance) missingFields.push("Vehicle Insurance");
  
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields:\n- ${missingFields.join("\n- ")}`);
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("place", place);
      formData.append("phone", phone);
      formData.append("profilePicture", profilePicture);
      formData.append("aadhar", aadhar);
      formData.append("license", license);
      formData.append("registration", registration);
      formData.append("insurance", insurance);
      formData.append("sleepy",sleepy);
      formData.append("drowsy",drowsy);
      formData.append("active",active);
      formData.append("yawn",yawn);
  
      const response = await fetch("http://localhost:5000/api/driver/signup", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Sign up successful!");
        setIsSignUp(false);
      } else {
        alert(result.error || "Sign up failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className={`cont ${isSignUp ? "s--signup" : ""}`}>
      <div className="form sign-in">
        <h2>Welcome</h2>
        <label>
          <span>Username</span>
          <input
            type="text"
            value={signInData.username}
            onChange={(e) =>
              setSignInData({ ...signInData, username: e.target.value })
            }
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={signInData.password}
            onChange={(e) =>
              setSignInData({ ...signInData, password: e.target.value })
            }
          />
        </label>
        <button type="button" className="submit" onClick={handleSignIn}>
          Sign In
        </button>
      </div>

      <div className="sub-cont">
        <div className="img">
          <div className="img__text m--up">
            <h3>Don't have an account? Please Sign up!</h3>
          </div>
          <div className="img__text m--in">
            <h3>If you already have an account, just sign in.</h3>
          </div>
          <div className="img__btn" onClick={handleToggle}>
            <span className="m--up">Sign Up</span>
            <span className="m--in">Sign In</span>
          </div>
        </div>

        <div className="form sign-up" style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <h2>Create your Account</h2>
          <label><span>Full Name</span>
            <input
              type="text"
              value={signUpData.fullName}
              onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
            />
          </label>
          <label><span>Username</span>
            <input
              type="text"
              value={signUpData.username}
              onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
            />
          </label>
          <label><span>Email</span>
            <input
              type="email"
              value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
            />
          </label>
          <label><span>Password</span>
            <input
              type="password"
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
            />
          </label>
          <label><span>Confirm Password</span>
            <input
              type="password"
              value={signUpData.confirmPassword}
              onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
            />
          </label>
          <label><span>Place</span>
            <input
              type="text"
              value={signUpData.place}
              onChange={(e) => setSignUpData({ ...signUpData, place: e.target.value })}
            />
          </label>
          <label><span>Phone Number</span>
            <input
              type="tel"
              value={signUpData.phone}
              onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
            />
          </label>
          <label><span>Profile Picture</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSignUpData({ ...signUpData, profilePicture: e.target.files[0] })}
            />
          </label>
          <label><span>Aadhar</span>
            <input
              type="file"
              onChange={(e) => setSignUpData({ ...signUpData, aadhar: e.target.files[0] })}
            />
          </label>
          <label><span>Driving License</span>
            <input
              type="file"
              onChange={(e) => setSignUpData({ ...signUpData, license: e.target.files[0] })}
            />
          </label>
          <label><span>Registration Certificate</span>
            <input
              type="file"
              onChange={(e) => setSignUpData({ ...signUpData, registration: e.target.files[0] })}
            />
          </label>
          <label><span>Vehicle Insurance</span>
            <input
              type="file"
              onChange={(e) => setSignUpData({ ...signUpData, insurance: e.target.files[0] })}
            />
          </label>

          <button type="button" className="submit" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;