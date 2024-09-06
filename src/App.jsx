import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";

// IMPORTED MODULES
import Navbar from "./components/nav/Navbar";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";

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
        <Route path="/signin" element={<SignInForm setUser={setUser} />} />
        <Route path="/signup" element={<SignUpForm setUser={setUser} />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

const HomePage = () => {
  return <h1>Welcome to the Home Page!</h1>;
};

export default App;

// Testing the ruleset #3
