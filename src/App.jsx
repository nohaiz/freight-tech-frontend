import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";

// IMPORTED MODULES
import Navbar from "./components/nav/Navbar";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import Landing from "./components/landing/Landing";
import LoadDashboard from "./components/driver/LoadDashboard";
import UserDetails from "./components/profiles/usersDetails";
import UserUpdate from "./components/profiles/UsersUpdate";
import DriversList from "./components/admin/users/DriverList";
import ShippersList from "./components/admin/users/ShipperList";
import AdminCreateForm from "./components/admin/users/AdminCreateUserForm";
import AdminUserDetails from "./components/admin/users/AdminUsersDetails";
import AdminUpdateForm from "./components/admin/users/AdminUpdateUserForm";
// import LoadDetails from "./components/driver/LoadDetails";

// SERVICES
import authServices from "./services/auth/authServices";
import profileServices from "./services/user/profileServices";

function App() {
  const [user, setUser] = useState(authServices.getUser());
  const navigate = useNavigate();

  const handleSignout = () => {
    authServices.signout();
    setUser(null);
  };

  const handleDelete = async (userId) => {
    try {
      await profileServices.deleteUser(userId);
      handleSignout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Navbar user={user} handleSignout={handleSignout} />
      <Routes>
        {!user ? (
          <>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Landing />} />
            <Route
              path="/auth/sign-in"
              element={<SignInForm setUser={setUser} />}
            />
            <Route
              path="/auth/sign-up"
              element={<SignUpForm setUser={setUser} />}
            />
          </>
        ) : (
          <>
            {/* PRIVATE ROUTES */}
            {/* DRIVER ROUTES */}
            {/* <Route
              path="/drivers/orders"
              element={<LoadDashboard user={user} />}
            />
            <Route
              path="/drivers/orders/:id"
              element={<LoadDetails user={user} />}
            /> */}
            {/* SHIPPER ROUTES */}
            {/* <Route
              path="/shippers/orders"
              element={<OrderDashboard user={user} />}
            /> */}
            {/* <Route
              path="/shippers/orders/new"
              element={<NewOrder user={user} />}
            /> */}
            {/* <Route path="/shippers/orders/:id" element={<OrderDetails />} /> */}
            {/* ADMIN ROUTES */}
            {/* <Route
              path="/admin/orders/new"
              element={<AdminOrderForm user={user} />}
            /> */}
            <Route path="admins/drivers" element={<DriversList />} />
            <Route path="admins/shippers" element={<ShippersList />} />
            <Route
              path="/users/:userId"
              element={<UserDetails user={user} handleDelete={handleDelete} />}
            />
            <Route
              path="/users/:userId/edit"
              element={<UserUpdate user={user} />}
            />
            <Route path="/admins/users" element={<AdminCreateForm />} />
            <Route
              path="/admins/users/:userId/edit"
              element={<AdminUpdateForm />}
            />
            <Route
              path="/admins/users/:userId"
              element={<AdminUserDetails />}
            />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
