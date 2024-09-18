import { useState, useEffect, useCallback } from "react";
import { GoogleMap, DirectionsRenderer, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useNavigate, useParams } from "react-router-dom";

import './form.css'

import adminUserServices from "../../services/adminUser/adminUserServices";
import adminOrderServices from "../../services/adminOrder/adminOrderServices";
import shipperServices from "../../services/shipperOrder/shipperServices";
import '../form/OrderForm.css';

const libraries = ["places"];

const OrderForm = ({ user, formatTimestamp }) => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 });

  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const [userData, setUserData] = useState([]);
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);

  const [formData, setFormData] = useState({
    customerId: user.role === 'admin' ? "" : user.role === 'shipper' ? `${user.userId}` : "",
    driverId: user.role === 'admin' ? "" : "null",
    pickupLocation: "",
    dropoffLocation: "",
    vehicleType: "",
    dimensions: "",
    weightValue: "",
    orderStatus: "pending",
    paymentAmount: "",
    deliveryTime: ""
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obtaining location:", error);
          setMapCenter({ lat: 24.7136, lng: 46.6753 });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const order = user.role === 'admin'
            ? await adminOrderServices.adminOrderDetails(orderId)
            : await shipperServices.shipperOrderDetails(orderId);

          setFormData({
            ...order,
            deliveryTime: formatTimestamp(order.deliveryTime),
          });

          setDistance(order.distance || "");
          setPaymentAmount(order.paymentAmount || "");
          setMapCenter({
            lat: order.pickupLat || 24.7136,
            lng: order.pickupLng || 46.6753,
          });
        } catch (error) {
          console.log("Error fetching order:", error);
        }
      };
      fetchOrder();
    }
  }, [orderId, user.role]);

  useEffect(() => {
    if (formData.pickupLocation && formData.dropoffLocation) {
      calculateRoute();
    }
  }, [formData.pickupLocation, formData.dropoffLocation, formData.vehicleType]);

  useEffect(() => {
    if (distance) {
      updatePaymentAmount();
    }
  }, [distance, formData.vehicleType]);

  if (user.role === 'admin') {
    if (orderId) {
      useEffect(() => {
        const fetchUser = async () => {
          try {
            const userData = await adminUserServices.indexUsers();
            setUserData(userData);
          } catch (err) {
            console.log(err)
          }
        }
        fetchUser();
      }, [])
    }
  }

  const calculateRoute = useCallback(() => {
    if (formData.pickupLocation && formData.dropoffLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: formData.pickupLocation,
          destination: formData.dropoffLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            const distanceText = result.routes[0]?.legs[0]?.distance?.text;
            const durationInSeconds = result.routes[0]?.legs[0]?.duration?.value;

            const currentTime = new Date();
            const arrivalTime = new Date(currentTime.getTime() + durationInSeconds * 1000);
            const formattedArrivalTime = arrivalTime.toISOString().replace('T', ' ').substring(0, 19);

            setDirections(result);
            setDistance(distanceText);
            setFormData(prev => ({ ...prev, deliveryTime: formattedArrivalTime }));
          } else {
            console.log("Error calculating route:", status);
          }
        }
      );
    }
  }, [formData.pickupLocation, formData.dropoffLocation]);

  const updatePaymentAmount = useCallback(() => {
    if (distance) {
      const distanceValue = parseFloat(distance.replace(/[^0-9.]/g, ''));
      let amount = distanceValue;

      switch (formData.vehicleType) {
        case 'car':
          amount *= 1.2;
          break;
        case 'van':
          amount *= 1.5;
          break;
        case 'truck':
          amount *= 2;
          break;
        default:
          break;
      }

      setPaymentAmount(amount.toFixed(3));
    }
  }, [distance, formData.vehicleType]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const orderData = { ...formData, paymentAmount };

      if (orderData.driverId === null) {
        orderData.driverId = "null";
      }

      if (user.role === 'admin') {
        if (orderId) {
          await adminOrderServices.updateAdminOrder(orderId, orderData);
        } else {
          await adminOrderServices.newAdminOrder(orderData);
        }
      } else {
        if (orderId) {
          await shipperServices.updateShipperOrder(orderId, orderData);
        } else {
          await shipperServices.newShipperOrder(orderData);
        }
      }

      navigate(`/${user.role}s/orders`);
    } catch (error) {
      console.log("Error submitting order:", error);
    }
  };


  const onLoadPickup = (autocomplete) => setPickupAutocomplete(autocomplete);
  const onLoadDropoff = (autocomplete) => setDropoffAutocomplete(autocomplete);

  const onPlaceChangedPickup = () => {
    if (pickupAutocomplete) {
      const place = pickupAutocomplete.getPlace();
      setFormData(prev => ({ ...prev, pickupLocation: place.formatted_address }));
    }
  };

  const onPlaceChangedDropoff = () => {
    if (dropoffAutocomplete) {
      const place = dropoffAutocomplete.getPlace();
      setFormData(prev => ({ ...prev, dropoffLocation: place.formatted_address }));
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (

    <main>

      <section className="section has-background-light">
        <div className="columns is vcentered" style={{ minHeight: "100vh" }}>
          <div className="column is-half">
            <form className="form-container" style={{ minWidth: "100%" }} onSubmit={handleSubmit}>
              {user.role === 'admin' ?
                <>
                  <label htmlFor="customerId">Shipper</label>
                  <select name="customerId" id="customerId" value={formData.customerId} onChange={handleChange}>
                    {orderId && formData.customerId && (
                      <option key={formData.customerId} value={formData.customerId}>
                        {userData.find(u => u.userId === formData.customerId)?.username}
                      </option>
                    )}
                    {userData.filter(user => user.roles.includes('shipper')).length > 0 ? (
                      userData.filter(user => user.roles.includes('shipper')).map(user => (
                        <option key={user.userId} value={user.userId}>{user.username}</option>
                      ))
                    ) : (
                      <option value="">No Shippers Available</option>
                    )}
                  </select>

                  <label htmlFor="driverId">Driver</label>
                  <select name="driverId" id="driverId" value={formData.driverId} onChange={handleChange}>
                    <option value={"null"}>None</option>
                    {orderId && formData.driverId && (
                      <option key={formData.driverId} value={formData.driverId}>
                        {userData.find(u => u.userId === formData.driverId)?.username}
                      </option>
                    )}
                    {userData.filter(user => user.roles.includes('driver')).map(user => (
                      <option key={user.userId} value={user.userId}>{user.username}</option>
                    ))}
                  </select>
                </>
                :
                <></>
              }

              <div className="field is-horizontal">
                <div id="form-inputs" className="field is-veritcal">
                  <label htmlFor="pickupLocation" style={{ color: 'gray' }}>Origin</label>
                  <Autocomplete onLoad={onLoadPickup} onPlaceChanged={onPlaceChangedPickup}>
                    <input
                      class="input is-small"
                      placeholder="Pick-up Address"
                      required
                      type="text"
                      name="pickupLocation"
                      id="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                    />
                  </Autocomplete>
                </div>

                <div id="form" className="field is-horizontal">
                  <div id="form-inputs" className="field is-veritcal">
                    <label htmlFor="dropoffLocation" style={{ color: 'gray' }}>Destination</label>
                    <Autocomplete onLoad={onLoadDropoff} onPlaceChanged={onPlaceChangedDropoff}>
                      <input
                        class="input is-small"
                        placeholder="Drop off Address"
                        required
                        type="text"
                        name="dropoffLocation"
                        id="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleChange}
                      />
                    </Autocomplete>
                  </div>
                </div>

              </div>
              <p>Order status: Pending</p>

              <label htmlFor="weightValue">Weight</label>
              <input
                placeholder="Weight"
                required
                type="text"
                name="weightValue"
                id="weightValue"
                value={formData.weightValue}
                onChange={handleChange}
              />

              <p>Rate: {paymentAmount ? paymentAmount : 0} BD</p>

              <label htmlFor="dimensions">Dimensions</label>
              <input
                placeholder="Dimensions"
                required
                type="text"
                name="dimensions"
                id="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
              />

              <label htmlFor="vehicleType" style={{ color: 'gray' }}>Vehicle type</label>
              <span class="select">
                <select
                  class="dropdown"
                  required
                  name="vehicleType"
                  id="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="car">Car</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                </select>
              </span>

              <p>Delivery time: {formData.deliveryTime || "0"}</p>

              <button class="button is-primary" id="submit" type="submit">{orderId ? 'Update' : 'Submit'}</button>

            </form>

          </div>

          <div className="column is-half">
            <div className="map-container" style={{ height: "100%" }}>
              <GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%" }}
                zoom={11}
                center={mapCenter}
                options={{
                  disableDefaultUI: true,
                }}
              >
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}

export default OrderForm;
