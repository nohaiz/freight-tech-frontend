import "../nav/nav.css";
import { Link } from "react-router-dom";

const Navbar = ({ user, handleSignout }) => {
  return (
    <nav>
      {!user ? (
        <>
          <Link to="/auth/sign-in">Sign In</Link>
          <Link to="/auth/sign-up">Sign Up</Link>
        </>
      ) : (
        <>
          <Link to={`/${user.role}s/orders`}>Home</Link>
          <Link to={`/users/${user.userId}`}>Profile</Link>
          {user.role === "admin" ? (
            <>
              {/* ADMIN ORDERS */}
              <Link to="/admin/orders/new" className="navbar-item">New Order</Link>
              {/* ADMIN USERS */}
              <Link to="/admins/shippers">Shippers</Link>
              <Link to="/admins/drivers">Drivers</Link>
              <Link to="/admins/users">Create User</Link>
              <a onClick={handleSignout} href="/"> Sign Out</a>
            </>
          ) : (
            <></>
          )}
          <a onClick={handleSignout} href="/">
            Sign Out
          </a>
        </>
      )}
    </nav>
  );
};

export default Navbar;
