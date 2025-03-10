import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ColourfulText } from "../ui/ColourfulText";
import { Boxes } from "../ui/Boxes"; // ✅ Import Boxes component
import config from "../config/config";

const Home = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/quiz/public`);
        const data = await response.json();
        if (response.ok) {
          setQuizzes(data.quizzes);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = () => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      navigate("/quiz");
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleAuth = async (type) => {
    const url = type === "login" ? "/auth/login" : "/auth/signup";
    const body = JSON.stringify(
      type === "login"
        ? { email: userData.email, password: userData.password }
        : { name: userData.name, email: userData.email, password: userData.password }
    );

    try {
      const response = await fetch(`${config.API_BASE_URL}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowLoginPopup(false);
        setShowSignupPopup(false);
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <Boxes className="absolute inset-0 opacity-50" /> 
      
      <div className="relative z-10 text-center p-6">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">
          Welcome to <ColourfulText text="QuizMaster!" />
        </h1>
        <p className="text-lg mb-6 text-gray-700">
          Welcome to QuizMaster, the ultimate AI-powered platform that transforms
          physical question papers into interactive online quizzes in just seconds!
        </p>

        <motion.button
          onClick={handleStartQuiz}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md"
          whileHover={{
            scale: 1.1,
            backgroundColor: "#2563eb",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </div>

      {/* ✅ Quizzes List */}
      <div className="relative z-10 mt-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/quiz/${quiz._id}`)}
            >
              <h3 className="text-xl font-bold">{quiz.title}</h3>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <button
              onClick={() => handleAuth("login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
            >
              Login
            </button>
            <p className="text-gray-600 text-center mt-3">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  setShowSignupPopup(true);
                }}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
            <button
              onClick={() => setShowLoginPopup(false)}
              className="mt-3 text-gray-600 hover:underline w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ Signup Popup */}
      {showSignupPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="w-full mb-3 p-2 border rounded-md"
            />
            <button
              onClick={() => handleAuth("signup")}
              className="bg-green-600 text-white px-4 py-2 rounded-md w-full hover:bg-green-700 transition"
            >
              Sign Up
            </button>
            <button
              onClick={() => setShowSignupPopup(false)}
              className="mt-3 text-gray-600 hover:underline w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
