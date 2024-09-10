import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderDetail.css";

import adminOrderServices from "../../services/admin/adminOrderServices";

const AdminOrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const deleteOrder = async () => {
    await adminOrderServices.deleteShipperOrder(id);
    navigate('/admin/orders')
  }
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const shipperData = await adminOrderServices.AdminUserOrderDetails (id);
        setOrderDetails(shipperData)
      } catch (err) {
        console.log(err);
      }
    }
    fetchOrderDetails();
  }, [id]);

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
      {orderDetails.orderStatus === "pending" ?
        <>
          <button type="button" onClick={() => { deleteOrder() }}>Delete Order</button>
          <button type="button"><Link to={`/admin/orders/${orderDetails.orderId}/edit`}>Edit Order</Link></button>
        </>
        : <></>
      }
    </>
  )
}


export default AdminOrderDetails;
