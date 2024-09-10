import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";  
import adminUserServices from "../../../services/adminUser/adminUserServices";  

const AdminOrderUserDetails = () => {
  const { userId} = useParams();
  const [user, setUser] = useState(null);
  const [assignableOrders, setAssignableOrders] = useState([]);  
  const [assignedOrders, setAssignedOrders] = useState([]);  
  const [shipperOrders, setShipperOrders] = useState([]);  
  const [orderDetails, setOrderDetails] = useState(null);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const userDetails = await adminUserServices.showUser(userId);
        setUser(userDetails);

        if (userDetails?.roles === 'driver') {
          if (userDetails?.vehicleType) {
            const availableOrders = await adminOrderServices.getOrdersByVehicleType(userDetails.vehicleType);
            setAssignableOrders(availableOrders);

            const driverOrders = await adminOrderServices.getOrdersByDriver(userId);
            setAssignedOrders(driverOrders);
          }
        }

        if (userDetails?.roles === 'shipper') {
          const shipperOrders = await adminOrderServices.getOrdersByShipper(userId);
          setShipperOrders(shipperOrders);

          if (userId) {
            const orderDetails = await shipperServices.shipperOrderDetails(userId);
            setOrderDetails(orderDetails);
          }
        }
      } catch (error) {
        console.error("Error fetching user or orders:", error);
      }
    };
    fetchUserAndOrders();
  }, [userId]);

  const handleAssignOrder = async (orderId) => {
    try {
      await adminOrderServices.assignOrderToDriver(orderId, userId);
      navigate(`/admin/orders/${userId}/edit`);
    } catch (error) {
      console.error("Error assigning order:", error);
    }
  };

  const handleUnassignOrder = async (orderId) => {
    try {
      await adminOrderServices.unassignOrder(orderId);
      navigate(`/admin/orders/${userId}/edit`);
    } catch (error) {
      console.error("Error unassigning order:", error);
    }
  };

  const deleteOrder = async () => {
    try {
      await shipperServices.deleteShipperOrder(id);
      navigate('/shippers/orders');
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div>
      <h1>Driver Order Details</h1>
      {user && (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Verified User:</strong> {user.verifiedUser ? "Yes" : "No"}</p>
          <p><strong>Role:</strong> {user.roles ? user.roles.join(", ") : "No roles available"}</p>
          {/* <p><strong>Vehicle Type:</strong> {user.vehicleType ? user.vehicleType.join(", ") : "No vehicle type available"}</p> */}

          {user.roles == 'driver' && (
            <div>
              <p><strong>Active Orders:</strong> {user.assignOrder ? user.assignOrder.length : 0}</p>
              <p><strong>Total Orders:</strong> {user.completeOrder ? user.completeOrder.length : 0}</p>

              <div>
                <label>Assign an Order: </label>
                <select onChange={(e) => handleAssignOrder(e.target.value)} defaultValue="">
                  <option value="" disabled>Select an order</option>
                  {assignableOrders.map(order => (
                    <option key={order.orderId} value={order.orderId}>
                      {order.pickupLocation} to {order.dropoffLocation} ({order.vehicleType})
                    </option>
                  ))}
                </select>
              </div>

              {assignedOrders.length > 0 && (
                <div>
                  <label>Unassign Order: </label>
                  <select onChange={(e) => handleUnassignOrder(e.target.value)} defaultValue="">
                    <option value="" disabled>Select an order</option>
                    {assignedOrders.map(order => (
                      <option key={order.orderId} value={order.orderId}>
                        {order.pickupLocation} to {order.dropoffLocation}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrderUserDetails;
