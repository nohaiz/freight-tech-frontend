import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminOrder/adminServices";

const AdminDriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await adminServices.indexUsers();
        const driverUsers = allUsers.filter((user) =>
          user.roles.includes("driver")
        );
        setDrivers(driverUsers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleViewOrderDetails = (userId) => {
    navigate(`/admin/orders/${userId}`);
  };

  return (
    <div>
      <h1>Driver List</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Verified User</th>
            <th>Role</th>
            <th>Vehicle Type</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.userId}>
              <td>{driver.username}</td>
              <td>{driver.email}</td>
              <td>{driver.verifiedUser ? "Yes" : "No"}</td>
              <td>{driver.roles.join(", ")}</td>
              <td>{driver.vehicleType ? driver.vehicleType.join(", ") : "N/A"}</td>
              <td>
                <button onClick={() => handleViewOrderDetails(driver.userId)}>
                  Manage Orders
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDriverList;
