import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuizDisplay = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedQuiz, setUpdatedQuiz] = useState({});
  const [status, setStatus] = useState("private");

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`http://localhost:4532/api/quiz/${quizId}`);
      const data = await response.json();
      if (response.ok) {
        setQuiz(data.quiz);
        setUpdatedQuiz(data.quiz);
        setStatus(data.quiz.isPublic ? "public" : "private");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const handleEditChange = (field, value) => {
    setUpdatedQuiz({ ...updatedQuiz, [field]: value });
  };

  const handleQuestionEdit = (index, field, value) => {
    const updatedQuestions = [...updatedQuiz.questions];
    updatedQuestions[index][field] = value;
    setUpdatedQuiz({ ...updatedQuiz, questions: updatedQuestions });
  };

  const updateQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4532/api/quiz/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedQuiz),
      });

      const data = await response.json();
      if (response.ok) {
        setQuiz(updatedQuiz);
        setEditMode(false);
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4532/api/question/${questionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchQuiz(); // Refresh quiz after deleting question
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const deleteQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4532/api/quiz/${quizId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate("/"); // Redirect to homepage after deleting quiz
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const toggleStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = status === "public" ? "private" : "public";
      const response = await fetch(`http://localhost:4532/api/quiz/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublic: newStatus === "public" }),
      });

      if (response.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error("Error toggling quiz status:", error);
    }
  };

  if (!quiz) return <div className="text-center text-gray-600 mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">{quiz.title}</h1>
      {editMode ? (
        <input
          type="text"
          value={updatedQuiz.title}
          onChange={(e) => handleEditChange("title", e.target.value)}
          className="w-full p-2 border rounded-md mb-2"
        />
      ) : (
        <p className="text-gray-700">{quiz.description}</p>
      )}

      <p className="text-gray-600">Marks: {quiz.totalMarks}</p>
      <p className="text-gray-600">Time Limit: {quiz.timeLimit} mins</p>

      <button onClick={toggleStatus} className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-4">
        Make {status === "public" ? "Private" : "Public"}
      </button>

      {/* Questions Section */}
      <h2 className="text-xl font-bold mt-6">Questions</h2>
      {quiz.questions.map((question, index) => (
        <div key={question._id} className="mt-4 p-3 border rounded-md">
          {editMode ? (
            <input
              type="text"
              value={updatedQuiz.questions[index].text}
              onChange={(e) => handleQuestionEdit(index, "text", e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          ) : (
            <p className="text-gray-700">{question.text}</p>
          )}

          <h3 className="font-semibold mt-2">Options:</h3>
          <ul>
            {question.options.map((option, optIndex) => (
              <li key={optIndex} className="text-gray-600">
                {editMode ? (
                  <input
                    type="text"
                    value={updatedQuiz.questions[index].options[optIndex]}
                    onChange={(e) =>
                      handleQuestionEdit(index, "options", [
                        ...updatedQuiz.questions[index].options.slice(0, optIndex),
                        e.target.value,
                        ...updatedQuiz.questions[index].options.slice(optIndex + 1),
                      ])
                    }
                    className="w-full p-1 border rounded-md"
                  />
                ) : (
                  <span>{option}</span>
                )}
              </li>
            ))}
          </ul>

          <button onClick={() => deleteQuestion(question._id)} className="text-red-500 mt-2">
            Delete Question
          </button>
        </div>
      ))}

      {/* Edit & Delete Buttons */}
      {editMode ? (
        <button onClick={updateQuiz} className="bg-green-600 text-white px-4 py-2 rounded-md mt-4">
          Save Changes
        </button>
      ) : (
        <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">
          Edit Quiz
        </button>
      )}

      <button onClick={deleteQuiz} className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 ml-2">
        Delete Quiz
      </button>
    </div>
  );
};

export default QuizDisplay;
