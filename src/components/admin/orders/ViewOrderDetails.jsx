import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";
import adminUserServices from "../../../services/adminUser/adminUserServices"; 
import "./adminOrder.css";

const ViewOrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [driverName , setDriverName] = useState("")

  const fetchOrderDetails = async () => {
    try {
      const shipperData = await adminOrderServices.adminOrderDetails(orderId);
      // driverName = await adminUserServices.showUser(shipperData.driverId)
      if (shipperData.driverId) {
        const driverData = await adminUserServices.showUser(shipperData.driverId);
        setDriverName(driverData.username)
      } else {
        setDriverName("No Driver Assigned");
      }
      setOrderDetails(shipperData);
    } catch (err) {
      console.log(err)
    }
  };

  const fetchUsers = async () => {
    try {
      const allUsers = await adminUserServices.indexUsers();
      
      const driverUsers = allUsers.filter((user) => user.roles.includes("driver"));
   
      setDrivers(driverUsers);
    } catch (err) {
     
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchUsers();
  }, [orderId]);

  const assignDriver = async () => {
    try {
      const updatedOrder = { ...orderDetails, driverId: selectedDriverId };
      await adminOrderServices.updateAdminOrder(orderId, updatedOrder); 
      setOrderDetails(updatedOrder); 
      fetchOrderDetails();
      fetchUsers();
    } catch (err) {
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await adminOrderServices.deleteOrder(orderId);
      navigate('/admin/orders'); 
    } catch (error) {
    }
  };

  const handleEditOrder = () => {
    navigate(`/admin/orders/${orderId}/edit`);
  };

  const orderOnRoute = async (orderId) => {
    try {
      const updatedOrder = { ...orderDetails, orderStatus: 'on_route' };
      await adminOrderServices.updateAdminOrder(orderId, updatedOrder);
      setOrderDetails(updatedOrder); 
    } catch (err) {
      console.error("Error updating order status to 'on_route':", err);
    }
  };
  
  const completedOrder = async (orderId) => {
    try {
      const updatedOrder = { ...orderDetails, orderStatus: 'completed' };
      await adminOrderServices.updateAdminOrder(orderId, updatedOrder);
      setOrderDetails(updatedOrder); 
    } catch (err) {
      console.error("Error updating order status to 'completed':", err);
    }
  };
  

  return (
    <>

    <div className="container mt-5">
      <h1 id="title" className="title">Order Details</h1>
      <table className="table is-striped is-hoverable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Driver</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Weight</th>
            <th>Dimensions</th>
            <th>Rate</th>
            <th>Vehicle</th>
            <th>Delivery time</th>
            <th>Created at</th>
            <th>Actions</th>

          </tr>
      </thead>
      <tbody>
        <tr>
          <td>{orderDetails.orderId}</td>
          <td>{driverName}</td>
          <td>{orderDetails.pickupLocation}</td>
          <td>{orderDetails.dropoffLocation}</td>
          <td>{orderDetails.orderStatus}</td>
          <td>{orderDetails.weightValue}</td>
          <td>{orderDetails.dimensions}</td>
          <td>{orderDetails.paymentAmount}</td>
          <td>{orderDetails.vehicleType}</td>
          <td>{orderDetails.deliveryTime}</td>
          <td>{orderDetails.createdAt}</td>
          <td>
            {orderDetails.orderId &&orderDetails.orderStatus !== "completed" && (
          <div>
            <label htmlFor="drivers">Assign a Driver: </label>
              <select
                id="drivers"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                >
                <option value="">Select a driver</option>
                {drivers.length > 0 ? (
                  drivers.map((driver) => (
                    <option key={driver.userId} value={driver.userId}>
                      {driver.username}
                    </option>
                  ))
                ) : (
                  <option disabled>No drivers available</option>
                )}
              </select>
          </div>
            )}
          {orderDetails.orderStatus !== "completed" && (
            <>
            <button id="view" className="button is-info is-dark" onClick={assignDriver}>Assign Driver</button>
            {orderDetails.driverId && orderDetails.orderStatus === 'pending' ? (
                <button id="deliv-status" className="has-background-warning button is-fullwidth" type="button" onClick={() => orderOnRoute(orderDetails.orderId)}>Update to On Route</button>
              ) : (<></>)
              }
              {orderDetails.orderStatus === 'on_route' ?
                (<button id="deliv-status" className="button has-background-success	 is-fullwidth" type="button" onClick={() => completedOrder(orderDetails.orderId)}> Order Delivered</button>) :
                (<></>)
              }

            <button id="edit" className="button" onClick={handleEditOrder} >Edit Order</button>
            <button id="cancel" className="button is-danger ml-2" onClick={handleDeleteOrder}>Cancel Order</button>
            </>
          )}  
              
          </td>

        </tr>
      </tbody>
      </table>
    </div>
      {orderDetails.orderStatus === "pending" && (
        <>

        </>
      )}
    </>
  );
};

export default ViewOrderDetails;
