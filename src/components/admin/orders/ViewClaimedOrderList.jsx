import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";  
import "./adminOrder.css";

const AdminClaimedOrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await adminOrderServices.indexOrders();
        const claimedOrders = allOrders.filter(order => order.driverId && order.orderStatus !== 'completed');  
        setOrders(claimedOrders);
      } catch (error) {
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
    }
  };

  return (
    <div>
      <h1 id="title" className="title-center">Claimed Order List</h1>
      <table>
        <thead>
          <tr>
            <th id="table-title">Customer ID</th>
            <th id="table-title">Driver ID</th>
            <th id="table-title">Pickup Location</th>
            <th id="table-title">Dropoff Location</th>
            <th id="table-title">Order Status</th>
            <th id="table-title">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td id="table-title">{order.customerId}</td>
              <td id="table-title">{order.driverId}</td>
              <td id="table-title">{order.pickupLocation}</td>
              <td id="table-title">{order.dropoffLocation}</td>
              <td id="table-title">{order.orderStatus}</td>
              <td>
                <button 
                className="button is-info" 
                id="view" 
                onClick={() => handleViewDetails(order.orderId)}>
                  View Details
                </button>

                {order.orderStatus !== "completed" && (
                  <button
                  id="cancel"
                  className="button is-danger ml-2"
                  onClick={() => handleDeleteOrder(order.orderId)}>
                    Cancel Order
                  </button>
                )} 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminClaimedOrderList;
