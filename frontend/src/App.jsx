import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./comps/Login";
import AdminLogin from "./comps/AdminLogin";
import CounselorLogin from "./comps/CounselorLogin";
import Counselor from "./comps/Counselor";
import AdminDB from "./comps/AdminDB";
import Navbar from "./comps/NavBar";
import Home from "./comps/Home";
import Footer from "./comps/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="logIn" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/counselorLogin" element={<CounselorLogin />} />
        <Route path="/counselor-DB" element={<ProtectedRoute role="counselor"><Counselor /></ProtectedRoute>} />
        <Route path="/admins-DB" element={<ProtectedRoute role="admin"><AdminDB /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;


