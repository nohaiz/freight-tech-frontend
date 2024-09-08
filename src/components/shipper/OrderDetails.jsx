import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

import shipperServices from "../../services/shipperOrder/shipperServices";

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const deleteOrder = async () => {
    await shipperServices.deleteShipperOrder(id);
    navigate('/shippers/orders')
  }
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const shipperData = await shipperServices.shipperOrderDetails(id);
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
          <button button type="button">This is the edit button but its not connected to anything</button>
        </>
        : <></>
      }
    </>
  )
}
export default OrderDetails

