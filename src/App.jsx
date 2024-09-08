import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";

// IMPORTED MODULES
import Navbar from "./components/nav/Navbar";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import Landing from "./components/landing/Landing";
import LoadDashboard from "./components/driver/LoadDashboard";

// SERVICES
import authServices from "./services/auth/authServices";

const handleSignout = () => {
  authServices.signout();
  setUser(null);
};
function App() {
  const [user, setUser] = useState(authServices.getUser());

  return (
    <>
      <Navbar user={user} handleSignout={handleSignout} />
      <Routes>
        {!user ? (<>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth/sign-in" element={<SignInForm setUser={setUser} />} />
          <Route path="/auth/sign-up" element={<SignUpForm setUser={setUser} />} />
        </>)
          : (<>
            {/* PRIVATE ROUTES */}
            <Route path="/drivers/orders" element={<LoadDashboard user={user} />} />
          </>)
        }

      </Routes>
    </>
  );
}

export default App;
