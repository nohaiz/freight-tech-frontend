import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import './dashboard.css';

import driverServices from "../../services/driverOrder/driverServices";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "350px",
};

const LoadDetails = ({ user, formatTimestamp }) => {
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

  useEffect(() => {
    calculateRoute();
  }, [orderDetails, calculateRoute]);

  const acceptOrder = async (id) => {
    const updatedOrderDetails = { ...orderDetails, driverId: user.userId };
    await driverServices.updateDriverOrder(id, updatedOrderDetails);
    navigate('/drivers/orders');
  };
  const completedOrder = async (id) => {
    const updatedOrderDetails = { ...orderDetails, driverId: user.userId, orderStatus: 'completed' };
    await driverServices.updateDriverOrder(id, updatedOrderDetails);
    navigate('/drivers/orders');
  }
  const orderOnRoute = async (id) => {
    const updatedOrderDetails = { ...orderDetails, driverId: user.userId, orderStatus: 'on_route' };
    await driverServices.updateDriverOrder(id, updatedOrderDetails);
    navigate('/drivers/orders');
  }

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1 className="title has-text-dark custom-title-details">Order Details</h1>
      <section className="card custom-card-details">
        <div className="card-content">
          <div className="columns is-multiline">
            <div className="column is-one-quarter">
              <div className="content">
                <p className="subtitle is-5">Order # {orderDetails.orderId}</p>
                <p className="subtitle is-5">Customer: {orderDetails.customerName}</p>
                <p className="subtitle is-5">Pick Up Location: {orderDetails.pickupLocation}</p>
                <p className="subtitle is-5">Drop Off Location: {orderDetails.dropoffLocation}</p>
                <p className="subtitle is-5">Order Status: {orderDetails.orderStatus === 'completed' ? 'Completed' : orderDetails.orderStatus === 'on_route' ? 'In Route' : 'Pending'}</p>
                <p className="subtitle is-5">Weight Value: {orderDetails.weightValue}</p>
              </div>
            </div>
            <div className="column is-one-quarter">
              <div className="content">
                <p className="subtitle is-5 ">Dimensions: {orderDetails.dimensions}</p>
                <p className="subtitle is-5">Payment Amount: {orderDetails.paymentAmount}</p>
                <p className="subtitle is-5">Vehicle Type: {orderDetails.vehicleType}</p>
                <p className="subtitle is-5">Delivery Time: {formatTimestamp(orderDetails.deliveryTime)}</p>
                <p className="subtitle is-5">Created At: {formatTimestamp(orderDetails.createdAt)}</p>
              </div>
            </div>
            <div className="column is-half">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
              >
                {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
              </GoogleMap>
            </div>
            <div className="buttons">
              {!orderDetails.driverId ? (
                <button className="button is-info is-fullwidth" type="button" onClick={() => acceptOrder(orderDetails.orderId)}> Accept Order</button>
              ) : (<></>)
              }
              {orderDetails.driverId && orderDetails.orderStatus === 'pending' ? (
                <button className="button is-fullwidth has-background-warning" type="button" onClick={() => orderOnRoute(orderDetails.orderId)}>Update to On Route</button>
              ) : (<></>)
              }
              {orderDetails.orderStatus === 'on_route' ?
                (<button className="button has-background-success	 is-fullwidth" type="button" onClick={() => completedOrder(orderDetails.orderId)}> Order Delivered</button>) :
                (<></>)
              }
            </div>
          </div>
        </div >
      </section >
    </div >
  );
};

export default LoadDetails;
