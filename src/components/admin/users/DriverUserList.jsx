import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminUser/adminUserServices";
const DriverUserList = () => {
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
      } catch (error) { }
    };
    fetchUsers();
  }, []);

  const handleViewDetails = (userId) => {
    navigate(`/admins/users/${userId}`);
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
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.userId}>
              <td>{driver.username}</td>
              <td>{driver.email}</td>
              <td>{driver.verifiedUser ? "Yes" : "No"}</td>
              <td>{driver.roles.join(", ")}</td>
              <td>
                <button onClick={() => handleViewDetails(driver.userId)}>
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

export default DriverUserList;
