import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminServices from "../../../services/adminOrder/adminServices"; 

const AdminClaimedOrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaimedOrders = async () => {
      try {
        const claimedOrders = await adminServices.getClaimedOrders();  
        setOrders(claimedOrders);
      } catch (error) {
        console.error("Error fetching claimed orders:", error);
      }
    };
    fetchClaimedOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await adminServices.deleteOrder(orderId);  
      setOrders(orders.filter((order) => order.orderId !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div>
      <h1>Claimed Order List</h1>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Driver ID</th>
            <th>Pickup Location</th>
            <th>Dropoff Location</th>
            <th>Order Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.customerId}</td>
              <td>{order.driverId}</td>
              <td>{order.pickupLocation}</td>
              <td>{order.dropoffLocation}</td>
              <td>{order.orderStatus}</td>
              <td>
                <button onClick={() => handleViewDetails(order.orderId)}>
                  View Details
                </button>
                <button onClick={() => handleDeleteOrder(order.orderId)}>
                  Cancel Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminClaimedOrderList;
