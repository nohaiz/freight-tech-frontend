import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminUser/adminUserServices";
import "./userList.css";
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
      } catch (error) {}
    };
    fetchUsers();
  }, []);

  const handleViewDetails = (userId) => {
    navigate(`/admins/users/${userId}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Driver List</h1>
      <table className="table is-striped is-hoverable">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Verified User</th>
            <th>Roles</th>
            <th></th>
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
                <button
                  className="button is-info is-dark"
                  onClick={() => handleViewDetails(driver.userId)}
                >
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
