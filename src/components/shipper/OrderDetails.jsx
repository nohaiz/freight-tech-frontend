import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import "../driver/dashboard.css";

import shipperServices from "../../services/shipperOrder/shipperServices";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "350px",
};

const OrderDetails = ({ formatTimestamp }) => {
  const [orderDetails, setOrderDetails] = useState({});
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const directionsService = isLoaded ? new window.google.maps.DirectionsService() : null;

  const calculateRoute = useCallback(() => {
    if (isLoaded && orderDetails.pickupLocation && orderDetails.dropoffLocation && directionsService) {
      directionsService.route(
        {
          origin: orderDetails.pickupLocation,
          destination: orderDetails.dropoffLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, orderDetails, directionsService]);

  const deleteOrder = async () => {
    await shipperServices.deleteShipperOrder(id);
    navigate('/shippers/orders');
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const shipperData = await shipperServices.shipperOrderDetails(id);
        setOrderDetails(shipperData);
      } catch (err) {
        console.log(err);
      }
    }
    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    calculateRoute();
  }, [orderDetails, calculateRoute]);

  const acceptOrder = async (orderId) => {
    const updatedOrderDetails = { ...orderDetails, driverId: user.userId };
    await driverServices.updateDriverOrder(orderId, updatedOrderDetails);
    navigate('/drivers/orders');
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="full-height">
      <div className="container mt-5">
        <h1 className="title has-text-dark custom-title-details">Order Details</h1>
        <section className="card custom-card-details">
          <div className="card-content">
            <div className="columns is-mobile is-multiline">
              <div className="column is-one-quarter">
                <p className="subtitle is-5">Order #{orderDetails.orderId}</p>
                <p className="subtitle is-5">Driver: {orderDetails.driverName ? orderDetails.driverName : <>Driver assignment pending</>}</p>
                <p className="subtitle is-5">Pick up location: {orderDetails.pickupLocation}</p>
                <p className="subtitle is-5">Drop off location: {orderDetails.dropoffLocation}</p>
                <p className="subtitle is-5">Order status: {orderDetails.orderStatus === 'completed' ? 'Completed' : orderDetails.orderStatus === 'on_route' ? 'In Route' : 'Pending'}</p>
                <p className="subtitle is-5">Weight value: {orderDetails.weightValue}</p>

              </div>
              <div className="column is-one-quarter">
                <p className="subtitle is-5">Dimensions: {orderDetails.dimensions}</p>
                <p className="subtitle is-5">Payment amount: {orderDetails.paymentAmount}</p>
                <p className="subtitle is-5">Vehicle type: {orderDetails.vehicleType}</p>
                <p className="subtitle is-5">Delivery time: {formatTimestamp(orderDetails.deliveryTime)}</p>
                <p className="subtitle is-5">Created at: {formatTimestamp(orderDetails.createdAt)}</p>
              </div>
              <div className="column">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={12}
                >
                  {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                </GoogleMap>
              </div>
            </div>
            <div className="buttons mt-4">
              {orderDetails.orderStatus === "pending" ?
                <>
                  <button
                    type="button"
                    onClick={deleteOrder}
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

export default OrderDetails;
