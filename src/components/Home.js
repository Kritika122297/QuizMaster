import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(loggedInUser));
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
      <button onClick={() => {
        localStorage.removeItem("user");
        navigate("/login");
      }}>
        Logout
      </button>
    </div>
  );
}

export default Home;
