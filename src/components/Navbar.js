import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
      {/* Left - Logo & Title */}
      <div className="flex items-center space-x-4">
        <img src="/icon.png" alt="Logo" className="h-10 w-10 rounded-full" />
        <span className="text-2xl font-bold tracking-wide">QuizMaster</span>
      </div>

      {/* Center - Navigation Links */}
      <div className="space-x-6">
        <Link to="/" className="hover:text-gray-400 transition">
          Home
        </Link>
        <Link to="/about" className="hover:text-gray-400 transition">
          About
        </Link>
      </div>

      {/* Right - Authentication Buttons */}
      <div className="space-x-3">
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg">Hi, {user.username}!</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-white text-blue-600 font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition">
                Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
