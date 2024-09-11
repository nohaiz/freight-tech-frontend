import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminUserServices from "../../../services/adminUser/adminUserServices";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices"; // Import order services

const AdminDriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]); // To store all orders
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch drivers and orders on component mount
    const fetchUsersAndOrders = async () => {
      try {
        const allUsers = await adminUserServices.indexUsers();
        const driverUsers = allUsers.filter((user) => user.roles.includes("driver"));
        setDrivers(driverUsers);

        const allOrders = await adminOrderServices.indexOrders(); // Fetch all orders
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching drivers or orders:", error);
      }
    };

    fetchUsersAndOrders();
  }, []);

  // Function to get the number of active orders for a specific driver
  const getActiveOrdersCount = (driverId) => {
    return orders.filter(
      (order) => order.driverId === driverId && order.orderStatus !== "complete"
    ).length;
  };

  // Function to get the number of completed orders for a specific driver
  const getCompletedOrdersCount = (driverId) => {
    return orders.filter(
      (order) => order.driverId === driverId && order.orderStatus === "complete"
    ).length;
  };

  const handleViewOrderDetails = (userId) => {
    navigate(`/admin/orders/${userId}`);
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
            <th>Active Orders</th>
            <th>Completed Orders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.userId}>
              <td>{driver.username}</td>
              <td>{driver.email}</td>
              <td>{driver.verifiedUser ? "Yes" : "No"}</td>
              <td>{getActiveOrdersCount(driver.userId)}</td> 
              <td>{getCompletedOrdersCount(driver.userId)}</td> 
              <td>
                <button 
                  className="button is-info is-dark"
                  onClick={() => handleViewOrderDetails(driver.userId)}
                >
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
