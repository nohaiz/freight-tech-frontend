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
      <h1 id="table-title" className="title-center">Unclaimed Order List</h1>
      <table>
        <thead>
          <tr>
            <th id="table-title">Customer ID</th>
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
              <td id="table-title">{order.pickupLocation}</td>
              <td id="table-title">{order.dropoffLocation}</td>
              <td id="table-title">{order.orderStatus}</td>
              <td id="table-title">
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

export default AdminUnclaimedOrderList;
