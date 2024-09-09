import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminUser/adminUserServices";

const ShipperUserList = () => {
  const [shippers, setShippers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await adminServices.indexUsers();
        const shipperUsers = allUsers.filter((user) =>
          user.roles.includes("shipper")
        );
        setShippers(shipperUsers);
      } catch (error) {
        console.error("Error fetching shippers:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleViewDetails = (userId) => {
    navigate(`/admins/users/${userId}`);
  };

  return (
    <div>
      <h1>Shipper List</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Verified User</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {shippers.map((shipper) => (
            <tr key={shipper.userId}>
              <td>{shipper.username}</td>
              <td>{shipper.email}</td>
              <td>{shipper.verifiedUser ? "Yes" : "No"}</td>
              <td>{shipper.roles.join(", ")}</td>
              <td>
                <button onClick={() => handleViewDetails(shipper.userId)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipperUserList;
