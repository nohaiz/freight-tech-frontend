import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
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
import ShipperOrderForm from "./components/shipper/ShipperOrderForm";

// ADMIN ORDERS COMPONENTS
import AdminOrderForm from "./components/admin/orders/AdminOrderForm";
import ViewAllOrderList from "./components/admin/orders/ViewAllOrderList";
import ViewClaimedOrderList from './components/admin/orders/ViewClaimedOrderList';
import ViewUnClaimedOrderList from './components/admin/orders/ViewUnClaimedOrderList';
import ViewDriverList from "./components/admin/orders/ViewDriverList";;
import ViewShipperList from "./components/admin/orders/ViewShipperList";
import DriverOrderDetails from "./components/admin/orders/DriverOrderDetails";
import ViewOrderDetails from "./components/admin/orders/ViewOrderDetails";
import ViewCompletedOrderList from "./components/admin/orders/ViewCompletedOrderList";

// ADMIN USERS COMPONENTS
import DriverUserList from "./components/admin/users/DriverUserList";
import ShipperUserList from "./components/admin/users/ShipperUserList";
import AdminCreateUserForm from "./components/admin/users/AdminCreateUserForm";
import AdminUserDetails from "./components/admin/users/AdminUserDetails";
import AdminUpdateUserForm from "./components/admin/users/AdminUpdateUserForm";

// PROFILE COMPONENTS
import UserDetails from "./components/profiles/UsersDetails";
import UsersForm from "./components/profiles/UsersForm";
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

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('en-US', options);
  }

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
            {user.role === 'driver' ?
              <>
                <Route path="/drivers/orders" element={<LoadDashboard user={user} formatTimestamp={formatTimestamp} />} />
                <Route path="/drivers/orders/:id" element={<LoadDetails user={user} formatTimestamp={formatTimestamp} />} />
              </>
              : <></>
            }
            {/* SHIPPER ROUTES */}
            {user.role === 'shipper' ?
              <>
                <Route path="/shippers/orders" element={<OrderDashboard user={user} formatTimestamp={formatTimestamp} />} />
                <Route path="/shippers/orders/new" element={<ShipperOrderForm user={user} formatTimestamp={formatTimestamp} />} />
                <Route path="/shippers/orders/:id" element={<OrderDetails formatTimestamp={formatTimestamp} />} />
                <Route path="/shippers/orders/:orderId/edit" element={<ShipperOrderForm user={user} formatTimestamp={formatTimestamp} />} />
              </> : <></>
            }
            {/* ADMIN ORDER ROUTES */}
            {user.role === 'admin' ?
              <>
                <Route path="/admins/orders" element={<ViewAllOrderList user={user} formatTimestamp={formatTimestamp} />} />
                <Route path="/admin/orders/new" element={<AdminOrderForm user={user} formatTimestamp={formatTimestamp} />} />
                <Route path="/admin/orders/claimed" element={<ViewClaimedOrderList user={user} />} />
                <Route path="/admin/orders/unclaimed" element={<ViewUnClaimedOrderList user={user} />} />
                <Route path="/admin/orders/drivers" element={<ViewDriverList />} />
                <Route path="/admin/orders/shippers" element={<ViewShipperList />} />
                <Route path="/admin/orders/:userId" element={<DriverOrderDetails />} />
                <Route path="/admin/orders/:orderId/details" element={<ViewOrderDetails />} />
                <Route path="/admin/orders/:orderId/edit" element={<AdminOrderForm user={user} formatTimestamp={formatTimestamp} />} />
                <Route path="/admins/orders/completed" element={<ViewCompletedOrderList user={user} formatTimestamp={formatTimestamp} />} />

                {/* ADMIN USERS ROUTES */}
                <Route path="/admins/users" element={<AdminCreateUserForm />} />
                <Route path="/admins/drivers" element={<DriverUserList />} />
                <Route path="/admins/shippers" element={<ShipperUserList />} />
                <Route path="/admins/users/:userId" element={<AdminUserDetails />} />
                <Route path="/admins/users/:userId/edit" element={<AdminUpdateUserForm/>} />
              </> : <></>
            }
            {/* PROFILES */}
            <Route path="/users/:userId" element={<UserDetails user={user} handleDelete={handleDelete} />} />
            <Route path="/users/:userId/edit" element={<UsersForm user={user} />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
