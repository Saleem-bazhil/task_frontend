import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import AcceptedTasks from "./pages/AcceptedTasks";
import CompletedTasks from "./pages/CompletedTasks";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import MyTasks from "./pages/MyTasks";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/messages" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="accepted-tasks" element={<AcceptedTasks />} />
            <Route path="completed-tasks" element={<CompletedTasks />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
