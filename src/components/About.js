import React from "react";

const About = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">About QuizMaster</h1>
      <p className="text-gray-700 mb-4">
        QuizMaster is an AI-powered quiz generation platform that helps you convert documents into interactive quizzes.
        Whether you're a student, teacher, or quiz enthusiast, QuizMaster makes learning fun and efficient.
      </p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Key Features:</h2>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Upload PDFs or images and generate quizzes instantly.</li>
        <li>AI-based question generation for better learning.</li>
        <li>Timed quizzes with scoring functionality.</li>
        <li>Public and private quiz options for better accessibility.</li>
        <li>User-friendly dashboard for managing quizzes.</li>
      </ul>
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Our Mission</h2>
      <p className="text-gray-700">
        We aim to simplify the process of learning and assessment by integrating technology with education.
        Our platform enables seamless quiz creation for educators and students alike.
      </p>
    </div>
  );
};

export default About;
