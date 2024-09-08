import React, { useState, useEffect } from "react";
import adminOrderService from "../../../services/adminOrder/adminServices";
import OrderList from "./OrderList"; // Assuming this is the component to display the list of orders

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const orderData = await adminOrderService.fetchAllOrders();
      setOrders(orderData);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    const result = await adminOrderService.deleteOrder(orderId);
    if (result) {
      setOrders(orders.filter(order => order._id !== orderId));
    }
  };

  return (
    <div>
      <h1>Admin Orders Dashboard</h1>
      <OrderList orders={orders} handleDeleteOrder={handleDeleteOrder} />
    </div>
  );
};

export default OrderDashboard;
