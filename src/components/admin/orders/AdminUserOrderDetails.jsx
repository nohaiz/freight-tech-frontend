import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";
import adminUserServices from "../../../services/adminUser/adminUserServices"; 

const AdminUserOrderDetails = () => {
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
      setDriverName(driverName)
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

  return (
    <>

    <div className="container mt-5">
      <h1 className="title">Order Details</h1>
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
          <td>{orderDetails.driverId}</td>
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
            <button className="button is-info is-dark" onClick={assignDriver}>Assign Driver</button>
            <button className="button is-danger ml-2" onClick={handleDeleteOrder}>Cancel Order</button>
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

export default AdminUserOrderDetails;
