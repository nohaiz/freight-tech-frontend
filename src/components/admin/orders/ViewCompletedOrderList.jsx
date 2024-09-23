import { useEffect, useState } from "react";
import { useNavigate,  useSearchParams } from "react-router-dom";
import "bulma/css/bulma.min.css";
import "./adminOrder.css";

import adminOrderServices from "../../../services/adminOrder/adminOrderServices";

const ViewCompletedOrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let fetchedOrders;
        if (userId) {
          fetchedOrders = await adminOrderServices.getOrdersByUserId(userId);  
        } else {
          fetchedOrders = await adminOrderServices.indexOrders(); 
        }

        const completedOrders = fetchedOrders.filter(order => order.orderStatus === 'completed');
        completedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(completedOrders);
      } catch (error) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}/details`);
  };


  return (
    <div className="container mt-5">
      <h1 id="table-title" className="title-center">Completed Order List</h1>
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
          
          {orders.length > 0 ? (
            orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.customerId}</td>
              <td>{order.driverId}</td>
              <td>{order.pickupLocation}</td>
              <td>{order.dropoffLocation}</td>
              <td>{order.orderStatus}</td>
              <td>
                <button
                  className="button is-info"
                  id="view"
                  onClick={() => handleViewDetails(order.orderId)}
                >
                  View Details
                </button>
                
              </td>
            </tr>
          ))
        ):(
          <tr>
              <td>No orders found.</td> 
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCompletedOrderList;
