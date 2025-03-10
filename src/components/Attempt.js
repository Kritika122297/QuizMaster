import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../config/config";

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem(`quiz_${quizId}_answers`)) || {});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [reviewData, setReviewData] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
    if (timeLeft !== null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/quiz/${quizId}`);
      const data = await response.json();
      if (response.ok) {
        setQuiz(data.quiz);
        setQuestions(shuffleArray(data.quiz.questions));
        setTimeLeft(data.quiz.timeLimit ? data.quiz.timeLimit * 60 : null);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleOptionChange = (questionId, selectedOption) => {
    const newAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(newAnswers);
    localStorage.setItem(`quiz_${quizId}_answers`, JSON.stringify(newAnswers));
  };

  useEffect(() => {
    setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
  }, [currentQuestionIndex, questions.length]);

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/quiz/${quizId}/attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(config.TOKEN_STORAGE_KEY)}`,
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        const result = await response.json();
        setScore(result.score);
        setReviewData(result.review);
        setSubmitted(true);
        localStorage.removeItem(`quiz_${quizId}_answers`);
      } else {
        console.error("Error submitting quiz");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
        <p className="text-lg">Your Score: {score} / {questions.length}</p>
        <button
          onClick={() => navigate(`/quiz/review/${user.id}`)}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Review Answers
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      {timeLeft !== null && (
        <p className="text-red-600 font-bold">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>
      )}
      <progress value={progress} max="100" className="w-full h-2 rounded bg-gray-300"></progress>
      <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
      <div className="bg-white p-4 shadow rounded-lg">
        <p className="font-medium">{questions[currentQuestionIndex]?.text}</p>
        <div className="mt-4">
          {questions[currentQuestionIndex]?.options.map((option, index) => (
            <label key={index} className="block">
              <input
                type="radio"
                name={questions[currentQuestionIndex]._id}
                value={option}
                checked={answers[questions[currentQuestionIndex]._id] === option}
                onChange={() => handleOptionChange(questions[currentQuestionIndex]._id, option)}
              />
              {option}
            </label>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-4 py-2 bg-gray-300 rounded">
            Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">
              Submit Quiz
            </button>
          ) : (
            <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">
              Next
            </button>
          )}
        </div>
        <button
          onClick={() => navigate(`/quiz/${quizId}/review`)}
          className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded"
        >
          Review Answers
        </button>
      </div>
    </div>
  );
};

export default AttemptQuiz;
