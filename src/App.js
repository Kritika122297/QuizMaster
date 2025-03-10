import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import Navbar from "./ui/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import About from "./components/About";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserAuth = async () => {

      const token = localStorage.getItem("token"); // Get token from storage
      console.log("Token being sent:", token);
      try {
        const response = await fetch("http://localhost:4532/api/auth/user", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.log("Unauthorized, clearing user state");
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking user authentication", error);
        setUser(null);
      }
    };

    checkUserAuth();
  }, []);

  return (
    <>
    <AuthProvider>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup setUser={setUser} /> : <Navigate to="/dashboard" />}
        />
        <Route path="/dashboard" element={<ProtectedRoute />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      </AuthProvider>
    </>
  );
}

function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Navigate to="/login" replace />;
}


export default App;
