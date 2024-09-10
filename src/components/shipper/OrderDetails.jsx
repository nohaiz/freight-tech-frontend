import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";

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
    <div className="full-height">
      <div className="container mt-5">
        <h1 className="title has-text-dark custom-title-details">Order Details</h1>
        <section className="card custom-card-details">
          <div className="card-content">
            <div className="columns is-mobile is-multiline">
              <div className="column is-half">
                <p className="subtitle is-5"><strong>Order no:</strong> {orderDetails.orderId}</p>
                <p className="subtitle is-5"><strong>Driver:</strong> {orderDetails.driverName ? orderDetails.driverName : <>Driver assignment pending</>}</p>
                <p className="subtitle is-5"><strong>Pick up location:</strong>  {orderDetails.pickupLocation}</p>
                <p className="subtitle is-5"><strong>Drop off location:</strong>  {orderDetails.dropoffLocation}</p>
                <p className="subtitle is-5"><strong>Order status:</strong>  {orderDetails.orderStatus}</p>
              </div>
              <div className="column is-half">
                <p className="subtitle is-5"><strong>Weight value:</strong>  {orderDetails.weightValue}</p>
                <p className="subtitle is-5"><strong>Dimensions:</strong>  {orderDetails.dimensions}</p>
                <p className="subtitle is-5"><strong>Payment amount:</strong>  {orderDetails.paymentAmount}</p>
                <p className="subtitle is-5"><strong>Vehicle type:</strong>  {orderDetails.vehicleType}</p>
                <p className="subtitle is-5"><strong>Delivery time:</strong>  {orderDetails.deliveryTime}</p>
                <p className="subtitle is-5"><strong>Created at:</strong>  {orderDetails.createdAt}</p>
              </div>
            </div>
            <div className="buttons mt-4">
              {orderDetails.orderStatus === "pending" ?
                <>
                  <button
                    type="button"
                    onClick={() => { deleteOrder() }}
                    className="button is-danger is-fullwidth mr-2"
                  >
                    Delete Order
                  </button>
                  <Link to={`/shippers/orders/${orderDetails.orderId}/edit`} className="button is-info is-fullwidth">
                    Edit Order
                  </Link>
                </>
                : <></>
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderDetails

