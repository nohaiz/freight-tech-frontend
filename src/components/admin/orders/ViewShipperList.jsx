import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminUserServices from "../../../services/adminUser/adminUserServices";

const ViewShipperList = () => {
  const [shippers, setShippers] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await adminUserServices.indexUsers();  
        const shipperUsers = allUsers.filter((user) =>
          user.roles.includes("shipper")
        ); 
        setShippers(shipperUsers);
      } catch (error) {
      }
    };
    fetchUsers();
  }, []);

  
  const handleViewOrders = (userId) => {
    navigate(`/admins/orders?userId=${userId}`); 
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Shipper List</h1>
      <table className="table is-striped is-hoverable">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Verified User</th>
            <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          {shippers.map((shipper) => (
            <tr key={shipper.userId}>
              <td>{shipper.username}</td>
              <td>{shipper.email}</td>
              <td>{shipper.verifiedUser ? "Yes" : "No"}</td>
              <td>
                <button className="button is-dark "
                 onClick={() => handleViewOrders(shipper.userId)}
                 >
                  View Orders
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewShipperList;
