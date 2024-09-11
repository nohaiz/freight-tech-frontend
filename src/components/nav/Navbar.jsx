import "../nav/nav.css";
import { Link } from "react-router-dom";

const Navbar = ({ user, handleSignout }) => {
  return (
    <div className="custom-nav">
      <nav className="navbar-menu">
        {!user ? (
          <>
            <div className="navbar-start">
              <Link className="navbar-item" to="/">Home</Link>
            </div>
            <div className="navbar-end">
              <Link className="navbar-item" to="/auth/sign-in">Sign In</Link>
              <Link className="navbar-item" to="/auth/sign-up">Sign Up</Link>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-start">
              <Link className="navbar-item" to={`/${user.role}s/orders`}>Dashboard</Link>
              <Link className="navbar-item" to={`/users/${user.userId}`}>Profile</Link>
            </div>
            <div className="navbar-end">
              <a className="navbar-item" onClick={handleSignout} href="/" style={{ cursor: 'pointer' }}>
                Sign Out
              </a>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
