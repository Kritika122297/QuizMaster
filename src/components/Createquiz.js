import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config/config";

const CreateQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [file, setFile] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem(config.TOKEN_STORAGE_KEY);
      if (!token) return;
      
      const response = await fetch(`${config.API_BASE_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a file before submitting.");

    const formData = new FormData();
    formData.append("title", quizTitle);
    formData.append("description", quizDescription);
    formData.append("totalMarks", totalMarks);
    formData.append("timeLimit", timeLimit);
    formData.append("file", file);

    try {
      const token = localStorage.getItem(config.TOKEN_STORAGE_KEY);
      if (!token) return;

      const method = editingQuiz ? "PUT" : "POST";
      const endpoint = editingQuiz ? `/quiz/${editingQuiz}` : "/quiz/create";

      const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit quiz");
      fetchQuizzes();
      setEditingQuiz(null);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz._id);
    setQuizTitle(quiz.title);
    setQuizDescription(quiz.description);
    setTotalMarks(quiz.totalMarks);
    setTimeLimit(quiz.timeLimit);
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const token = localStorage.getItem(config.TOKEN_STORAGE_KEY);
      if (!token) return;
      
      await fetch(`${config.API_BASE_URL}/quiz/${quizId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Create or Edit a Quiz</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <input type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Quiz Title" className="w-full p-2 border rounded-md mb-4" required />
        <textarea value={quizDescription} onChange={(e) => setQuizDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded-md mb-4" required></textarea>
        <input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="Total Marks" className="w-full p-2 border rounded-md mb-4" required />
        <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} placeholder="Time Limit (mins)" className="w-full p-2 border rounded-md mb-4" />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border rounded-md mb-4" required={!editingQuiz} />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md w-full">{editingQuiz ? "Update Quiz" : "Create Quiz"}</button>
      </form>
      
      <div className="mt-10 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Your Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-blue-600">{quiz.title}</h3>
              <p className="text-gray-700">{quiz.description}</p>
              <p className="text-gray-600">Marks: {quiz.totalMarks}</p>
              <p className="text-gray-600">Time Limit: {quiz.timeLimit} mins</p>
              <div className="flex justify-between mt-3">
                <button onClick={() => navigate(`/quiz/${quiz._id}`)} className="bg-green-500 text-white px-4 py-2 rounded-md">Attempt Quiz</button>
                <button onClick={() => handleEdit(quiz)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Edit</button>
                <button onClick={() => handleDelete(quiz._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
