import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

import driverServices from "../../services/driverOrder/driverServices";

const LoadDetails = ({ user }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const acceptOrder = async (id) => {
    orderDetails['driverId'] = user.userId
    await driverServices.updateDriverOrder(id, orderDetails)
    navigate('/drivers/orders')
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const driverData = await driverServices.driverOrderDetails(id);
        setOrderDetails(driverData)
      } catch (err) {
        console.log(err);
      }
    }
    fetchOrderDetails();
  }, [id]);

  return (
    <>
      <p>Order no: {orderDetails.orderId}</p>
      <p>Customer: {orderDetails.customerName}</p>
      <p>Pick up location: {orderDetails.pickupLocation}</p>
      <p>Drop off location: {orderDetails.dropoffLocation}</p>
      <p>Order status: {orderDetails.orderStatus}</p>
      <p>Weight value: {orderDetails.weightValue}</p>
      <p>Dimensions: {orderDetails.dimensions}</p>
      <p>Payment amount: {orderDetails.paymentAmount}</p>
      <p>Vehicle type: {orderDetails.vehicleType}</p>
      <p>Delivery time: {orderDetails.deliveryTime}</p>
      <p>Created at: {orderDetails.createdAt}</p>
      {!orderDetails.driverId ?
        <button type="button" onClick={() => { acceptOrder(orderDetails.orderId) }}>Accept Order</button>
        :
        orderDetails.orderStatus !== 'completed' && orderDetails.orderStatus !== 'on_route' ?
          <button button type="button">This is the edit button but its not connected to anything</button>
          :
          <></>
      }
    </>
  )
}
export default LoadDetails

