import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config/config"; // Import config

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user details using stored JWT
  const fetchUser = async (token) => {
    if (!token) {
      console.error("No token found, user is not authenticated.");
      setUser(null);
      return;
    }
  
    console.log("Fetching user with token:", token); // Debugging line
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.log(`Failed to fetch user, status: ${response.status}`);
        setUser(null);
        localStorage.removeItem(config.TOKEN_STORAGE_KEY);
        return;
      }
  
      const data = await response.json();
      console.log("User data fetched:", data);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };
  useEffect(() => {
    if (user) {
      console.log("User set, navigating to dashboard...");
      navigate("/dashboard");
    }
  }, [user, navigate]);
  

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        console.log("Login failed!");
        alert("Invalid credentials");
        return;
      }
  
      const data = await response.json();
      console.log("Login successful, setting token:", data.token);
  
      localStorage.setItem(config.TOKEN_STORAGE_KEY, data.token);
  
      console.log("Fetching user...");
      const userData = await fetchUser(data.token); // Wait for user data
  
      if (userData) {
        console.log("User set, navigating to dashboard...");
        navigate("/dashboard"); // Ensure user is set before navigation
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem(config.TOKEN_STORAGE_KEY); // Remove token
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
