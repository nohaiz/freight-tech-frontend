import { useState } from "react";
import { Link } from "react-router-dom";
import 'bulma/css/bulma.min.css'; 
import { FaHome, FaUser, FaUsers, FaTruck, FaSignOutAlt, FaCog } from "react-icons/fa"; // Importing Font Awesome icons
import "./Sidebar.css";

const Sidebar = ({ user, handleSignout }) => {
  const [isUserDropdownActive, setUserDropdownActive] = useState(false);
  const [isOrderDropdownActive, setOrderDropdownActive] = useState(false);

  const toggleUserDropdown = () => setUserDropdownActive(!isUserDropdownActive);
  const toggleOrderDropdown = () => setOrderDropdownActive(!isOrderDropdownActive);

  return (
    <aside className="custom-side">
      <h1 id="Freight-tech">Freight-Tech</h1>
      <nav className="sidebar-menu">
        {!user ? (
          <div className="sidebar-links">
            <Link className="sidebar-item" to="/">
              <FaHome />
              <span className="link-text">Home</span>
            </Link>
            <Link className="sidebar-item" to="/auth/sign-in">
              <FaSignOutAlt />
              <span className="link-text">Sign In</span>
            </Link>
            <Link className="sidebar-item" to="/auth/sign-up">
              <FaUsers />
              <span className="link-text">Sign Up</span>
            </Link>
          </div>
        ) : (
          <div className="sidebar-links">
            <Link className="sidebar-item" to={`/${user.role}s/orders`}>
              <FaHome />
              <span className="link-text">Home</span>
            </Link>
            <Link className="sidebar-item" to={`/users/${user.userId}`}>
              <FaUser />
              <span className="link-text">Profile</span>
            </Link>
            
            <div>
            {/* Admin-specific dropdown for managing users */}
            {user.role === "admin" && (
              <div className={`dropdown ${isUserDropdownActive ? "is-active" : ""}`}>
                <button className="dropdown-button" onClick={toggleUserDropdown}>
                  <FaCog />
                  <span className="link-text">Manage Users</span>
                  <span className={`icon is-small fas ${isUserDropdownActive ? 'fa-angle-up' : 'fa-angle-down'}`}></span>
                </button>
                {isUserDropdownActive && (
                  <div className="dropdown-menu">
                    <Link to="/admins/shippers" className="dropdown-item">
                      Shippers
                    </Link>
                    <Link to="/admins/drivers" className="dropdown-item">
                      Drivers
                    </Link>
                    <Link to="/admins/users" className="dropdown-item">
                      Create User
                    </Link>
                  </div>
                )}
              </div>
            )}
            </div>

            <div>

            {/* Admin-specific dropdown for managing orders */}
            {user.role === "admin" && (
              <div className={`dropdown ${isOrderDropdownActive ? "is-active" : ""}`}>
                <button className="dropdown-button" onClick={toggleOrderDropdown}>
                  <FaTruck />
                  <span className="link-text">Manage Orders</span>
                  <span className={`icon is-small fas ${isOrderDropdownActive ? 'fa-angle-up' : 'fa-angle-down'}`}></span>
                </button>
                {isOrderDropdownActive && (
                  <div className="dropdown-menu">
                    <Link to="/admin/orders/new" className="dropdown-item">New Order</Link>
                    <Link to="/admin/orders/shippers" className="dropdown-item">All Shippers</Link>
                    <Link to="/admin/orders/drivers" className="dropdown-item">All Drivers</Link>
                    <Link to="/admins/orders" className="dropdown-item">All Orders</Link>
                    <Link to="/admin/orders/claimed" className="dropdown-item">Claimed Orders</Link>
                    <Link to="/admin/orders/unclaimed" className="dropdown-item">Unclaimed Orders</Link>
                    <Link to="/admins/orders/completed" className="dropdown-item">Completed Orders</Link>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        )}

        <div className="sidebar-end">
          <button className="sidebar-item" onClick={handleSignout}>
            <FaSignOutAlt />
            <span className="link-text">Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
