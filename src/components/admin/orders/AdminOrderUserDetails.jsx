import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";  
import adminUserServices from "../../../services/adminUser/adminUserServices";  
import "bulma/css/bulma.min.css";

const AdminOrderUserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [allOrders, setAllOrders] = useState([]); 
  const [assignedOrders, setAssignedOrders] = useState([]);  
  const [selectedAssignOrderId, setSelectedAssignOrderId] = useState('');  
  const [selectedUnassignOrderId, setSelectedUnassignOrderId] = useState('');  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const userDetails = await adminUserServices.showUser(userId);
        setUser(userDetails);

        const allOrdersData = await adminOrderServices.indexOrders();
        setAllOrders(allOrdersData);

        if (userDetails?.roles.includes('driver')) {
          const driverOrders = allOrdersData.filter(order => order.driverId === parseInt(userId));
          setAssignedOrders(driverOrders);
        }
      } catch (error) {
        console.error("Error fetching user and orders:", error);
      }
    };

    fetchUserAndOrders();
  }, [userId]);

  const handleAssignOrder = async () => {
    try {
      const orderDetails = await adminOrderServices.adminOrderDetails(selectedAssignOrderId);
      const updatedOrder = { ...orderDetails, driverId: userId }; 
      await adminOrderServices.updateAdminOrder(selectedAssignOrderId, updatedOrder);
      setAssignedOrders([...assignedOrders, updatedOrder]); 
      navigate(`/admin/orders/${userId}/edit`);
    } catch (error) {
      console.error("Error assigning order:", error);
    }
  };

const handleUnassignOrder = async () => {
  try {
    const orderDetails = await adminOrderServices.adminOrderDetails(selectedUnassignOrderId);
    
    const updatedOrder = { ...orderDetails, driverId: null }; 
    
    setAssignedOrders(assignedOrders.filter(order => order.orderId !== selectedUnassignOrderId));
    
    setAllOrders(allOrders.map(order => 
      order.orderId === selectedUnassignOrderId ? updatedOrder : order
    ));

    navigate(`/admin/orders/${userId}/edit`);
  } catch (error) {
    console.error("Error unassigning order:", error);
  }
};

  return (
    <div className="background">
      <div className="box">
        <div className="content">
          <h1 className="title">Driver Order Details</h1>
          {user && (
            <div className="user-details">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Verified User:</strong> {user.verifiedUser ? "Yes" : "No"}</p>

              {user.roles.includes('driver') && (
                <div>
                  <p><strong>Active Orders:</strong> {assignedOrders.length}</p>
                  <p><strong>Total Orders:</strong> {allOrders.length}</p>

                  <div>
                    <label>Assign an Order: </label>
                    <select
                      onChange={(e) => setSelectedAssignOrderId(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select an order</option>
                      {allOrders.map(order => (
                        <option key={order.orderId} value={order.orderId}>
                          {order.pickupLocation} to {order.dropoffLocation} ({order.vehicleType})
                        </option>
                      ))}
                    </select>
                    <button className="button is-primary ml-2" onClick={handleAssignOrder}>
                      Confirm Assign
                    </button>
                  </div>

                  {assignedOrders.length > 0 && (
                    <div>
                      <label>Unassign Order: </label>
                      <select
                        onChange={(e) => setSelectedUnassignOrderId(e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select an order</option>
                        {assignedOrders.map(order => (
                          <option key={order.orderId} value={order.orderId}>
                            {order.pickupLocation} to {order.dropoffLocation}
                          </option>
                        ))}
                      </select>
                      <button className="button is-danger ml-2" onClick={handleUnassignOrder}>
                        Confirm Unassign
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderUserDetails;
