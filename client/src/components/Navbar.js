import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="backdrop-blur-lg bg-white/30 border-b p-4 flex justify-between items-center">
      
      <h1 className="text-xl font-bold">Smart Planner</h1>

      <div className="space-x-6 flex items-center">

        {!user ? (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-700">
              User ID: {user.userId}
            </span>
          
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/add-task">Add Task</Link>
            <Link to="/groups/:groupId">Group Workspace</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/ai-planner">AI Planner</Link>
            <Link to="/profile">Profile</Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;