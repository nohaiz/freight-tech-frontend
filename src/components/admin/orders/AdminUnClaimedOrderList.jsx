import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";  

const AdminUnclaimedOrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await adminOrderServices.indexOrders();
        const unclaimedOrders = allOrders.filter(order => !order.driverId);  
        setOrders(unclaimedOrders);
        console.log(unclaimedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}/details`);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await adminOrderServices.deleteOrder(orderId);  
      setOrders(orders.filter((order) => order.orderId !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div>
      <h1>Unclaimed Order List</h1>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
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

export default AdminUnclaimedOrderList;
