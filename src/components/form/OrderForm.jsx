import { useState, useEffect, useCallback } from "react";
import { GoogleMap, DirectionsRenderer, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useParams } from "react-router-dom";


import adminUserServices from "../../services/adminUser/adminUserServices";
import adminOrderServices from "../../services/adminOrder/adminOrderServices";
import shipperServices from "../../services/shipperOrder/shipperServices";

const libraries = ["places"];

const OrderForm = ({ user }) => {
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
      <GoogleMap
        mapContainerStyle={{ height: "350px", width: "100%" }}
        zoom={10}
        center={mapCenter}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <form onSubmit={handleSubmit}>
        {user.role === 'admin' ?
          <>
            <label htmlFor="customerId">Shipper</label>
            <select name="customerId" id="customerId" value={formData.customerId} onChange={handleChange}>
              <option value={"null"}>None</option>
              {userData.filter(user => user.roles.includes('shipper')).map(user => (
                <option key={user.userId} value={user.userId}>{user.username}</option>
              ))}
            </select>
            <label htmlFor="driverId">Driver</label>
            <select name="driverId" id="driverId" value={formData.driverId} onChange={handleChange}>
              <option value={"null"}>None</option>
              {userData.filter(user => user.roles.includes('driver')).map(user => (
                <option key={user.userId} value={user.userId}>{user.username}</option>
              ))}
            </select>
          </>

          :
          <></>
        }

        <label htmlFor="pickupLocation">Pick-up</label>
        <Autocomplete onLoad={onLoadPickup} onPlaceChanged={onPlaceChangedPickup}>
          <input
            placeholder="Pick-up Address"
            required
            type="text"
            name="pickupLocation"
            id="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
          />
        </Autocomplete>

        <label htmlFor="dropoffLocation">Dropoff</label>
        <Autocomplete onLoad={onLoadDropoff} onPlaceChanged={onPlaceChangedDropoff}>
          <input
            placeholder="Drop off Address"
            required
            type="text"
            name="dropoffLocation"
            id="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
          />
        </Autocomplete>
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

        <label htmlFor="vehicleType">Vehicle type</label>
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

        <p>Delivery time: {formData.deliveryTime || "0"}</p>

        <button id="submit" type="submit">{orderId ? 'Update' : 'Submit'}</button>
      </form>
    </main>
  );
}

export default OrderForm;
