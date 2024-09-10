import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";  

const AdminUserOrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [drivers, setDrivers] = useState([]); 
  const [selectedDriverId, setSelectedDriverId] = useState(''); 
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const shipperData = await adminOrderServices.adminOrderDetails(orderId); 
        setOrderDetails(shipperData);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchDrivers = async () => {
      try {
        const driverData = await adminOrderServices.getAllDrivers(); 
        setDrivers(driverData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrderDetails();
    fetchDrivers();
  }, [orderId]);

  const assignDriver = async () => {
    try {
      const updatedOrder = { ...orderDetails, driverId: selectedDriverId };
      await adminOrderServices.updateAdminOrder(orderId, updatedOrder); 
      setOrderDetails(updatedOrder); 
    } catch (err) {
      console.log(err);
    }
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
      
      {orderDetails.orderStatus === "pending" &&
        <>
          
          <div>
            <label htmlFor="drivers">Assign Driver: </label>
            <select
              id="drivers"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
            >
              <option value="">Select a driver</option>
              {drivers.map((driver) => (
                <option key={driver.driverId} value={driver.driverId}>
                  {driver.driverName}
                </option>
              ))}
            </select>
          </div>
            <button onClick={() => handleDeleteOrder(order.orderId)}>
              Cancel Order
            </button>
        </>
      }
    </>
  );
};

export default AdminUserOrderDetails;
