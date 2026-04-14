import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask";
import Navbar from "./components/Navbar";
import CalendarView from "./pages/CalendarView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import AIPlanner from "./pages/AIPlanner";
import GroupWorkspace from "./pages/GroupWorkspace";
function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/groups/:groupId" element={<GroupWorkspace />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;