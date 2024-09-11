import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";
import adminUserServices from "../../../services/adminUser/adminUserServices"; // Import the user services

const AdminUserOrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Fetch order details and driver list on component mount
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const shipperData = await adminOrderServices.adminOrderDetails(orderId);
        setOrderDetails(shipperData);
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const allUsers = await adminUserServices.indexUsers(); // Use indexUsers to fetch all users
        console.log("All Users:", allUsers); // Debugging log
        const driverUsers = allUsers.filter((user) => user.roles.includes("driver"));
        console.log("Driver Users:", driverUsers); // Debugging log
        setDrivers(driverUsers);
      } catch (err) {
        console.error("Error fetching drivers:", err);
      }
    };

    fetchOrderDetails();
    fetchUsers();
  }, [orderId]);

  const assignDriver = async () => {
    try {
      const updatedOrder = { ...orderDetails, driverId: selectedDriverId };
      await adminOrderServices.updateAdminOrder(orderId, updatedOrder); // Update order in backend
      setOrderDetails(updatedOrder); // Update order in frontend
    } catch (err) {
      console.error("Error assigning driver:", err);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await adminOrderServices.deleteOrder(orderId);
      navigate('/admin/orders'); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <>
      <p>Order no: {orderDetails.orderId}</p>
      <p>Driver: {orderDetails.driverName ? orderDetails.driverName : <>Driver assignment pending</>}</p>
      <p>Pick up location: {orderDetails.pickupLocation}</p>
      <p>Drop off location: {orderDetails.dropoffLocation}</p>
      <p>Order status: {orderDetails.orderStatus}</p>
      <p>Weight value: {orderDetails.weightValue}</p>
      <p>Dimensions: {orderDetails.dimensions}</p>
      <p>Payment amount: {orderDetails.paymentAmount}</p>
      <p>Vehicle type: {orderDetails.vehicleType}</p>
      <p>Delivery time: {orderDetails.deliveryTime}</p>
      <p>Created at: {orderDetails.createdAt}</p>
      <p>Driver: {orderDetails.driverId}</p>

      {orderDetails.orderStatus === "pending" && (
        <>
          <div>
            <label htmlFor="drivers">Assign a Driver: </label>
            <select
              id="drivers"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
            >
              <option value="">Select a driver</option>
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <option key={driver.userId} value={driver.userId}>
                    {driver.username}
                  </option>
                ))
              ) : (
                <option disabled>No drivers available</option>
              )}
            </select>
            <button onClick={assignDriver}>Assign Driver</button>
          </div>

          <button onClick={handleDeleteOrder}>Cancel Order</button>
        </>
      )}
    </>
  );
};

export default AdminUserOrderDetails;
