import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate(); // ✅ Correct placement

  const [isSignUp, setIsSignUp] = useState(false);

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSignIn = () => {
  const { username, password } = signInData;

  if (username && password) {
    fetch("https://driver-drowsy-detection-with-ride-booking.onrender.com/api/user/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          alert("Sign in successful!");

          // ✅ Save to localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: data.user.name,
              phone: data.user.phone,
            })
          );

          setSignInData({ username: "", password: "" });
          navigate("/user/view-drivers");
        } else {
          alert(data.message || "Login failed");
        }
      })
      .catch((err) => {
        console.error("Signin error:", err);
        alert("Server error");
      });
  } else {
    alert("Please fill in all fields.");
  }
};


  const handleSignUp = () => {
    const { name, username, email, phone, password, confirmPassword } = signUpData;
    // Basic regex validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d).{6,}$/;

    if (name && username && email && phone && password && confirmPassword) {
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
      if (password === confirmPassword) {
        fetch("https://driver-drowsy-detection-with-ride-booking.onrender.com/api/user/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, username, email, phone, password }),
        })
          .then((res) => {
            if (res.ok) {
              alert("Sign up successful!");
              setIsSignUp(false);
              setSignUpData({
                name: "",
                username: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
              });
            } else {
              return res.text().then((text) => alert(text));
            }
          })
          .catch((err) => {
            console.error("Signup error:", err);
            alert("Server error");
          });
      } else {
        alert("Passwords do not match.");
      }
    } else {
      alert("Please fill in all fields.");
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

        <div className="form sign-up">
          <h2>Create your Account</h2>

          <label>
            <span>Full Name</span>
            <input
              type="text"
              value={signUpData.name}
              onChange={(e) =>
                setSignUpData({ ...signUpData, name: e.target.value })
              }
            />
          </label>

          <label>
            <span>Username</span>
            <input
              type="text"
              value={signUpData.username}
              onChange={(e) =>
                setSignUpData({ ...signUpData, username: e.target.value })
              }
            />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
            />
          </label>

          <label>
            <span>Phone Number</span>
            <input
              type="text"
              value={signUpData.phone}
              onChange={(e) =>
                setSignUpData({ ...signUpData, phone: e.target.value })
              }
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
            />
          </label>

          <label>
            <span>Confirm Password</span>
            <input
              type="password"
              value={signUpData.confirmPassword}
              onChange={(e) =>
                setSignUpData({ ...signUpData, confirmPassword: e.target.value })
              }
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

export default UserLogin;
