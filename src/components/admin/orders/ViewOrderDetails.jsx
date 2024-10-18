import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import adminOrderServices from "../../../services/adminOrder/adminOrderServices";
import adminUserServices from "../../../services/adminUser/adminUserServices"; 
import "./adminOrder.css";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "350px",
};
const mapOptions = {
  mapTypeControl: false,
  zoomControl: false,
};

const ViewOrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [driverName, setDriverName] = useState("");
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const directionsService = isLoaded ? new window.google.maps.DirectionsService() : null;

  const fetchOrderDetails = async () => {
    try {
      const shipperData = await adminOrderServices.adminOrderDetails(orderId);
      if (shipperData.driverId) {
        const driverData = await adminUserServices.showUser(shipperData.driverId);
        setDriverName(driverData.username);
      } else {
        setDriverName("No Driver Assigned");
      }
      setOrderDetails(shipperData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const allUsers = await adminUserServices.indexUsers();
      const driverUsers = allUsers.filter((user) => user.roles.includes("driver"));
      setDrivers(driverUsers);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

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
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, orderDetails, directionsService]);

  useEffect(() => {
    fetchOrderDetails();
    fetchUsers();
  }, [orderId]);

  useEffect(() => {
    calculateRoute();
  }, [orderDetails, calculateRoute]);

  const assignDriver = async () => {
    try {
      const updatedOrder = { ...orderDetails, driverId: selectedDriverId };
      await adminOrderServices.updateAdminOrder(orderId, updatedOrder);
      setOrderDetails(updatedOrder);
      fetchOrderDetails();
    } catch (err) {
      console.log(err);
    }
  };

  const orderOnRoute = async () => {
    try {
      const updatedOrder = { ...orderDetails, orderStatus: 'on_route' };
      await adminOrderServices.updateAdminOrder(orderId, updatedOrder);
      setOrderDetails(updatedOrder);
    } catch (err) {
      console.error("Error updating order status to 'on_route':", err);
    }
  };

  const completedOrder = async () => {
    try {
      const updatedOrder = { ...orderDetails, orderStatus: 'completed' };
      await adminOrderServices.updateAdminOrder(orderId, updatedOrder);
      setOrderDetails(updatedOrder);
    } catch (err) {
      console.error("Error updating order status to 'completed':", err);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await adminOrderServices.deleteOrder(orderId);
      navigate('/admin/orders');
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditOrder = () => {
    navigate(`/admin/orders/${orderId}/edit`);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="full-height">
      <div className="container mt-6 custom-container-padding">
        <section className="card custom-card-details">
          <div className="card-content">
            <div className="columns is-mobile is-multiline">
              <div className="column is-one-quarter">
                <p className="subtitle is-5">Order #{orderDetails.orderId}</p>
                <p className="subtitle is-5">Driver: {driverName || "Pending"}</p>
                <p className="subtitle is-4">Origin: {orderDetails.pickupLocation}</p>
                <p className="subtitle is-4">Destination: {orderDetails.dropoffLocation}</p>
                <p className="subtitle is-5">Order status: {orderDetails.orderStatus}</p>
                <p className="subtitle is-5">Weight: {orderDetails.weightValue}</p>
              </div>
              <div className="column is-one-quarter">
                <p className="subtitle is-5">Dimensions: {orderDetails.dimensions}</p>
                <p className="subtitle is-5">Payment amount: {orderDetails.paymentAmount}</p>
                <p className="subtitle is-5">Vehicle type: {orderDetails.vehicleType}</p>
                <p className="subtitle is-5">Delivery time: {orderDetails.deliveryTime}</p>
                <p className="subtitle is-5">Created at: {orderDetails.createdAt}</p>
              </div>
              <div className="column">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={12}
                  options={mapOptions}
                >
                  {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                </GoogleMap>
              </div>
            </div>
            <div className="buttons">

              {orderDetails.orderStatus === "pending" && (
                <>
                  <div className="centered-container">
                    <label htmlFor="drivers">Assign a Driver: </label>
                      <select
                        id="drivers"
                        value={selectedDriverId}
                        onChange={(e) => setSelectedDriverId(e.target.value)}
                      >
                        <option value="">Select a driver</option>
                        {drivers.map((driver) => (
                          <option key={driver.userId} value={driver.userId}>
                            {driver.username}
                          </option>
                        ))}
                      </select>
                  </div>

                  <button onClick={assignDriver} className="button has-background-info">
                    Assign Driver
                  </button>
                </>
              )}

              {orderDetails.driverId && orderDetails.orderStatus === 'pending' && (
                <button
                  id="deliv-status"
                  className="has-background-warning button is-fullwidth"
                  type="button"
                  onClick={orderOnRoute}
                >
                  Update to On Route
                </button>
              )}

              {orderDetails.orderStatus === 'on_route' && (
                <button
                  id="deliv-status"
                  className="button has-background-success is-fullwidth"
                  type="button"
                  onClick={completedOrder}
                >
                  Order Delivered
                </button>
              )}

              {(orderDetails.orderStatus === "pending" || orderDetails.orderStatus === "on_route") && (
                <button onClick={handleEditOrder} className="button has-background-warning">
                  Edit Order
                </button>
              )}
              
              {(orderDetails.orderStatus === "pending" || orderDetails.orderStatus === "on_route") && (
                <button onClick={handleDeleteOrder} className="button has-background-danger">
                  Delete Order
                </button>
              )}

            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
