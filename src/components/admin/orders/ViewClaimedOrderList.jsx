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
    <div className="container mt-5">
      <h1 className="title-center">Claimed Order List</h1>
      <table className="table is-striped is-hoverable">
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
