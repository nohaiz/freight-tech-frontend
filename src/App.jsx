import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";

// IMPORTED MODULES
import Navbar from "./components/nav/Navbar";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import Landing from "./components/landing/Landing";
import Dashboard from "./components/dashboard/Dashboard";

// SERVICES
import authServices from "./services/authServices";

const handleSignout = () => {
  authServices.signout();
  setUser(null);
};
function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <Navbar user={user} handleSignout={handleSignout} />
      <Routes>
        {!user ? (<>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignInForm setUser={setUser} />} />
          <Route path="/signin" element={<SignInForm setUser={setUser} />} />
          <Route path="/signup" element={<SignUpForm setUser={setUser} />} />
        </>)
          : (<>
            {/* PRIVATE ROUTES */}
            <Route path="/" element={<Dashboard />} />
          </>)
        }

      </Routes>
    </>
  );
}

export default App;
