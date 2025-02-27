import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">Quiz Master</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-gray-400 transition">Home</Link>
        <Link to="/login" className="hover:text-gray-400 transition">Login</Link>
        <Link to="/register" className="hover:text-gray-400 transition">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
