import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";  
import adminUserServices from "../../../services/adminUser/adminUserServices";  
import "bulma/css/bulma.min.css";
import "./adminOrder.css";


const DriverOrderDetails = () => {
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
      navigate(`/admin/orders/${userId}`);
    } catch (error) {
      console.error("Error assigning order:", error);
    }
  };
  

  const handleUnassignOrder = async () => {
    try {
      const orderDetails = await adminOrderServices.adminOrderDetails(selectedUnassignOrderId);
      const updatedOrder = { ...orderDetails, driverId: "0" }; 
      await adminOrderServices.updateAdminOrder(selectedUnassignOrderId, updatedOrder);
      setAssignedOrders(assignedOrders.filter(order => order.orderId !== selectedUnassignOrderId));
      setAllOrders(allOrders.map(order => 
        order.orderId === selectedUnassignOrderId ? updatedOrder : order
      ));
  
      navigate(`/admin/orders/${userId}`);
    } catch (error) {
      console.error("Error unassigning order:", error);
    }
  };
  
  return (
    <div className="background">
      <div id="driverBox" className="box">
        <div className="content">
          <h1 id="driverBox-title" className="title">Driver Order Details</h1>
          {user && (
            <div className="user-details">
              <p><strong id="li-title">Username:</strong> {user.username}</p>
              <p><strong id="li-title">Email:</strong> {user.email}</p>
              <p><strong id="li-title">Verified User:</strong> {user.verifiedUser ? "Yes" : "No"}</p>

              {user.roles.includes('driver') && (
                <div className="user-details">
                  <p><strong id="li-title">Active Orders:</strong> {assignedOrders.filter(order => order.orderStatus !== 'completed').length}</p>
                  <p><strong id="li-title">Total Orders:</strong> {allOrders.filter(order => order.driverId === parseInt(userId)).length}</p>
                  <div>
                    <label>Assign an Order: </label>
                    <select
                        onChange={(e) => setSelectedAssignOrderId(e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select an order</option>
                        {allOrders
                          .filter(order => (!order.driverId || order.driverId !== parseInt(userId)) && order.orderStatus !== 'completed')
                          .map(order => (
                            <option key={order.orderId} value={order.orderId}>
                              {order.pickupLocation} to {order.dropoffLocation} ({order.vehicleType})
                            </option>
                          ))}
                    </select>

                    <button id="edit" className="button is-primary ml-2" onClick={async () => 
                      {await handleAssignOrder();
                      window.location.reload();}}>
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
                        {assignedOrders.filter(order => order.orderStatus !== 'completed').map(order => (
                          <option key={order.orderId} value={order.orderId}>
                            {order.pickupLocation} to {order.dropoffLocation}
                          </option>
                        ))}
                      </select>
                      <button id="cancel" className="button is-danger ml-2" onClick={async () => 
                      {await handleUnassignOrder();
                      window.location.reload();}}>
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

export default DriverOrderDetails;
