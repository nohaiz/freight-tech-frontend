import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthedUserContext } from '../../App'; // Make sure the context is imported correctly
import 'bulma/css/bulma.min.css'; 
import "./Sidebar.css";

const Sidebar = ({ handleSignout }) => {
  const user = useContext(AuthedUserContext); // Get the current user from context

  return (
    <aside style={{ width: '200px', padding: '20px', backgroundColor: '#f4f4f4', height: '100%', position: 'fixed', top: 0, overflowY: 'auto', left: 0 }}>
      <ul id='menu-list' className="menu-list">
        {user ? (
          <>
          <div>
            <li><Link to="/admin/orders/shippers">All Shippers</Link></li>
            <li><Link to="/admin/orders/drivers">All Drivers</Link></li>
            <li><Link to="/admin/orders">All Orders</Link></li>
            <li><Link to="/admin/orders/claimed">Claimed Orders</Link></li>
            <li><Link to="/admin/orders/unclaimed">Unclaimed Orders</Link></li>
          </div>
          </>
        ) : null}
      </ul>
    </aside>
  );
};

export default Sidebar;
