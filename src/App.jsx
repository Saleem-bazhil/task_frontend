import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import MyTasks from './pages/MyTasks';
import AcceptedTasks from './pages/AcceptedTasks';
import CompletedTasks from './pages/CompletedTasks';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="accepted-tasks" element={<AcceptedTasks />} />
          <Route path="completed-tasks" element={<CompletedTasks />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
