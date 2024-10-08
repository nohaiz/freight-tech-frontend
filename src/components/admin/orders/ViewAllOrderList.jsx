import { useEffect, useState } from "react";
import { useNavigate,  useSearchParams } from "react-router-dom";
import "bulma/css/bulma.min.css";
import "./adminOrder.css";

import adminOrderServices from "../../../services/adminOrder/adminOrderServices";

const ViewAllOrderList = () => {
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
        fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(fetchedOrders);
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

  const handleDeleteOrder = async (orderId) => {
    try {
      await adminOrderServices.deleteOrder(orderId);
      setOrders(orders.filter((order) => order.orderId !== orderId)); 
    } catch (error) {
      setErrorMessage("Failed to delete the order. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="title-center">Order List {userId ? `for User ${userId}` : ""}</h1>
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
                
                {order.orderStatus !== "completed" && (
                  <button
                    id="cancel"
                    className="button is-danger ml-2"
                    onClick={() => handleDeleteOrder(order.orderId)}
                  >
                    Cancel Order
                  </button>
                )}

              </td>
            </tr>
          ))
        ):(
          <tr>
              <td>No orders found for this user.</td> 
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllOrderList;
