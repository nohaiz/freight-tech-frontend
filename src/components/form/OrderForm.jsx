import { useState, useEffect, useCallback } from "react";
import { GoogleMap, DirectionsRenderer, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useNavigate, useParams } from "react-router-dom";

import './form.css'

import adminUserServices from "../../services/adminUser/adminUserServices";
import adminOrderServices from "../../services/adminOrder/adminOrderServices";
import shipperServices from "../../services/shipperOrder/shipperServices";

const libraries = ["places"];

const OrderForm = ({ user }) => {
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
            ? await adminOrderServices(orderId)
            : await shipperServices.shipperOrderDetails(orderId);

          setFormData({
            ...order,
            deliveryTime: new Date(order.deliveryTime).toISOString().replace('T', ' ').substring(0, 19),
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
    if (!orderId) {
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
        case 'suv':
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
      if (user.role === 'admin') {
        if (orderId) {
          await adminOrderServices.updateAdminOrder(orderId, { ...formData, paymentAmount });
        } else {
          await adminOrderServices.newAdminOrder({ ...formData, paymentAmount });
        }
      }
      else {
        if (orderId) {
          await shipperServices.updateShipperOrder(orderId, { ...formData, paymentAmount })
        }
        else {
          await shipperServices.newShipperOrder({ ...formData, paymentAmount });
        }
      }
      navigate(`/${user.role}s/orders`)
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
    <main className="main-map">
      <form onSubmit={handleSubmit} className="form-container-map">
        <h1 className="title is-2 has-text-centered custom-title">{orderId ? 'Update Order' : 'New Order'}</h1>
        {user.role === 'admin' ?
          <>
            <label htmlFor="customerId" className="label has-text-white">Shipper</label>
            <select name="customerId" id="customerId" value={formData.customerId} onChange={handleChange}>
              <option value={`${user.role === 'admin' ? '0' : null}`}>None</option>
              {userData.filter(user => user.roles.includes('shipper')).map(user => (
                <option key={user.userId} value={user.userId}>{user.username}</option>
              ))}
            </select>
            <label htmlFor="driverId" className="label has-text-white">Driver</label>
            <select name="driverId" id="driverId" value={formData.driverId} onChange={handleChange}>
              <option value={`${user.role === 'admin' ? '0' : null}`}>None</option>
              {userData.filter(user => user.roles.includes('driver')).map(user => (
                <option key={user.userId} value={user.userId}>{user.username}</option>
              ))}
            </select>
          </>

          :
          <></>
        }
        <label htmlFor="pickupLocation" className="label has-text-white">Pick-up</label>
        <Autocomplete onLoad={onLoadPickup} onPlaceChanged={onPlaceChangedPickup}>
          <input
            placeholder="Pick-up Address"
            required
            type="text"
            name="pickupLocation"
            id="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            className="input"
          />
        </Autocomplete>

        <label htmlFor="dropoffLocation" className="label has-text-white">Dropoff</label>
        <Autocomplete onLoad={onLoadDropoff} onPlaceChanged={onPlaceChangedDropoff}>
          <input
            placeholder="Drop off Address"
            required
            type="text"
            name="dropoffLocation"
            id="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
            className="input"
          />
        </Autocomplete>

        <label htmlFor="orderStatus" className="label has-text-white">Order status:</label>
        <input
          type="text"
          name="orderStatus"
          id="orderStatus"
          value={formData.orderStatus}
          className="input"
          readOnly
        />

        <label htmlFor="weightValue" className="label has-text-white">Weight</label>
        <input
          placeholder="Weight"
          required
          type="text"
          name="weightValue"
          id="weightValue"
          value={formData.weightValue}
          onChange={handleChange}
          className="input"
        />

        <label htmlFor="paymentAmount" className="label has-text-white">Rate</label>
        <input
          type="text"
          name="paymentAmount"
          id="paymentAmount"
          value={paymentAmount}
          className="input"
          readOnly
        />

        <label htmlFor="dimensions" className="label has-text-white">Dimensions</label>
        <input
          placeholder="Dimensions"
          required
          type="text"
          name="dimensions"
          id="dimensions"
          value={formData.dimensions}
          onChange={handleChange}
          className="input"
        />

        <label htmlFor="vehicleType" className="label has-text-white">Vehicle type</label>
        <select
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

        <label htmlFor="deliveryTime" className="label has-text-white">Delivery time</label>
        <input
          placeholder="Delivery Time"
          type="text"
          name="deliveryTime"
          id="deliveryTime"
          value={formData.deliveryTime || "0"}
          onChange={handleChange}
          className="input"
        />

        <button id="submit" type="submit">{orderId ? 'Update' : 'Submit'}</button>
      </form>
      <div className="content custom-content-map">
        <GoogleMap
          mapContainerStyle={{ height: "100vh", width: "45vw" }}
          zoom={10}
          center={mapCenter}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </main>
  );
}

export default OrderForm;
