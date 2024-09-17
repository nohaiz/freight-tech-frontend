import "../nav/nav.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = ({ user, handleSignout }) => {
  const [isUserDropdownActive, setUserDropdownActive] = useState(false);
  const [isOrderDropdownActive, setOrderDropdownActive] = useState(false);

  const toggleUserDropdown = () => setUserDropdownActive(!isUserDropdownActive);
  const toggleOrderDropdown = () => setOrderDropdownActive(!isOrderDropdownActive);

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
              <Link className="navbar-item" to={`/${user.role}s/orders`}>Home</Link>
              <Link className="navbar-item" to={`/users/${user.userId}`}>Profile</Link>

              {/* Admin-specific dropdown for managing users */}
              {user.role === "admin" && (
                <div className={`dropdown ${isUserDropdownActive ? "is-active" : ""}`}>
                  <div className="dropdown-trigger">
                    <button
                      className="button has-background-dark"
                      aria-haspopup="true"
                      aria-controls="user-dropdown-menu"
                      onClick={toggleUserDropdown}
                    >
                      <span>Manage Users</span>
                      <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div className="dropdown-menu" id="user-dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      <Link to="/admins/shippers" className="dropdown-item">Shippers</Link>
                      <Link to="/admins/drivers" className="dropdown-item">Drivers</Link>
                      <Link to="/admins/users" className="dropdown-item">Create User</Link>
                      <hr className="dropdown-divider" />
                    </div>
                  </div>
                </div>
              )}

              {/* Admin-specific dropdown for managing orders */}
              {user.role === "admin" && (
                <div className={`dropdown ${isOrderDropdownActive ? "is-active" : ""}`}>
                  <div className="dropdown-trigger">
                    <button
                      className="button has-background-dark"
                      aria-haspopup="true"
                      aria-controls="order-dropdown-menu"
                      onClick={toggleOrderDropdown}
                    >
                      <span>Manage Orders</span>
                      <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div className="dropdown-menu" id="order-dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      <Link to="/admin/orders/new" className="dropdown-item">New Order</Link>
                      <Link to="/admin/orders/shippers" className="dropdown-item">All Shippers</Link>
                      <Link to="/admin/orders/drivers" className="dropdown-item">All Drivers</Link>
                      <Link to="/admins/orders" className="dropdown-item">All Orders</Link>
                      <Link to="/admin/orders/claimed" className="dropdown-item">Claimed Orders</Link>
                      <Link to="/admin/orders/unclaimed" className="dropdown-item">Unclaimed Orders</Link>
                    </div>
                  </div>
                </div>
              )}
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
