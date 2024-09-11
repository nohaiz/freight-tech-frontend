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
            <Link to="/admin/orders/shippers">All Shippers</Link>
                
                <li>
                  <Link to="/admin/orders/drivers">All Drivers</Link>
                </li>
                <li>
                  <Link to="/admin/orders">All Orders</Link>
                </li>
                <li>
                  <Link to="/admin/orders/claimed">Claimed Orders</Link> 
                </li>
                <li>
                  <Link to="/admin/orders/unclaimed">Unclaimed Orders</Link>
                </li>

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
