import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import driverServices from "../../services/driverOrder/driverServices";

const LoadDetails = ({ user }) => {
  const [orderDetails, setOrderDetails] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const acceptOrder = async (id) => {
    const updatedOrderDetails = { ...orderDetails, driverId: user.userId };
    await driverServices.updateDriverOrder(id, updatedOrderDetails);
    navigate('/drivers/orders');
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const driverData = await driverServices.driverOrderDetails(id);
        setOrderDetails(driverData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrderDetails();
  }, [id]);

  return (
    <div className="full-height">
      <div className="container mt-5">
        <h1 className="title has-text-dark custom-title-details">Order Details</h1>
        <section className="card custom-card-details">
          <div className="card-content">
            <div className="columns is-mobile is-multiline">
              <div className="column is-half">
                <p className="subtitle is-5"><strong>Order No:</strong> {orderDetails.orderId}</p>
                <p className="subtitle is-5"><strong>Customer:</strong> {orderDetails.customerName}</p>
                <p className="subtitle is-5"><strong>Pick Up Location:</strong> {orderDetails.pickupLocation}</p>
                <p className="subtitle is-5"><strong>Drop Off Location:</strong> {orderDetails.dropoffLocation}</p>
                <p className="subtitle is-5"><strong>Order Status:</strong> {orderDetails.orderStatus}</p>
              </div>
              <div className="column is-half">
                <p className="subtitle is-5"><strong>Weight Value:</strong> {orderDetails.weightValue}</p>
                <p className="subtitle is-5"><strong>Dimensions:</strong> {orderDetails.dimensions}</p>
                <p className="subtitle is-5"><strong>Payment Amount:</strong> {orderDetails.paymentAmount}</p>
                <p className="subtitle is-5"><strong>Vehicle Type:</strong> {orderDetails.vehicleType}</p>
                <p className="subtitle is-5"><strong>Delivery Time:</strong> {orderDetails.deliveryTime}</p>
                <p className="subtitle is-5"><strong>Created At:</strong> {orderDetails.createdAt}</p>
              </div>
            </div>
            <div className="buttons">
              {!orderDetails.driverId ? (
                <button
                  className="button is-info is-fullwidth"
                  type="button"
                  onClick={() => acceptOrder(orderDetails.orderId)}
                >
                  Accept Order
                </button>
              ) : (
                orderDetails.orderStatus !== 'completed' && orderDetails.orderStatus !== 'on_route' && (
                  <button
                    className="button is-warning is-fullwidth"
                    type="button"
                  >
                    Edit Order
                  </button>
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoadDetails;
