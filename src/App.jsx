import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

// IMPORTED MODULES
import Navbar from "./components/nav/Navbar";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import Landing from "./components/landing/Landing";
// DRIVER COMPONENTS
import LoadDashboard from "./components/driver/LoadDashboard";
import LoadDetails from "./components/driver/LoadDetails";
// SHIPPER COMPONENTS
import OrderDashboard from "./components/shipper/OrderDashboard";
import OrderDetails from "./components/shipper/OrderDetails";
import NewOrder from "./components/shipper/OrderForm";
// ADMIN COMPONENTS
import AdminOrderForm from "./components/admin/orders/AdminOrderForm";

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
            {/* DRIVER ROUTES */}
            <Route path="/drivers/orders" element={<LoadDashboard user={user} />} />
            <Route path="/drivers/orders/:id" element={<LoadDetails user={user} />} />
            {/* SHIPPER ROUTES */}
            <Route path="/shippers/orders" element={<OrderDashboard user={user} />} />
            <Route path="/shippers/orders/new" element={<NewOrder user={user} />} />
            <Route path="/shippers/orders/:id" element={<OrderDetails />} />
            {/* ADMIN ROUTES */}
            <Route path="/admin/orders/new" element={<AdminOrderForm user={user} />} />

          </>)
        }

      </Routes >
    </>
  );
}

export default App;
