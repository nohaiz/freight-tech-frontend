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
          <a onClick={handleSignout} href="/">
            Sign Out
          </a>
          {user.role === "admin" ? (
            <div className="tabs is-centered">
              <ul>
                <li>
                  <Link to="/admin/orders/new" className="navbar-item">
                    New Order
                  </Link>
                </li>
                <li>
                  <Link to="/admins/shippers">Shippers</Link>
                </li>
                <li>
                  <Link to="/admins/drivers">Drivers</Link>
                </li>
                <li>
                  <Link to="/admins/users">Create User</Link>
                </li>
              </ul>
            </div>
          ) : (
            <>
            </>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
