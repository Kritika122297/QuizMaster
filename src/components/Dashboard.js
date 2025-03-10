import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config/config";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchQuizzes();
  }, [activeTab]);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem(config.TOKEN_STORAGE_KEY);
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      let endpoint = `${config.API_BASE_URL}/quiz/all`; // Default: fetch all quizzes
      if (activeTab === "user") {
        endpoint = `${config.API_BASE_URL}/quiz/user`; // Fetch only user's quizzes
      }

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Hi, {user?.username || "Guest"}!</h1>

      <button
        onClick={() => navigate("/create-quiz")}
        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition mb-6"
      >
        ➕ Create Quiz
      </button>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("all")}
        >
          📚 All Quizzes
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "user" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("user")}
        >
          📝 My Quizzes
        </button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {quizzes.length === 0 ? (
          <p className="text-gray-600 text-center col-span-3">No quizzes found create one for yourself! Try out!!.</p>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-lg font-bold text-blue-600">{quiz.title}</h3>
              <p className="text-gray-700">{quiz.description}</p>
              <p className="text-gray-600">Marks: {quiz.totalMarks}</p>
              <p className="text-gray-600">Time Limit: {quiz.timeLimit} mins</p>
              <p className="text-gray-600">
                Status:{" "}
                <span className={quiz.isPublic ? "text-green-600" : "text-red-600"}>
                  {quiz.isPublic ? "Public" : "Private"}
                </span>
              </p>

              {/* Attempt Quiz Button */}
              <button
                onClick={() => navigate(`/quiz/${quiz._id}/attempt`)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3 w-full hover:bg-blue-600 transition"
              >
                ▶ Attempt Quiz
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
