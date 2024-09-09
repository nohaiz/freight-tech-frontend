import { useState, useEffect } from "react";
import { GoogleMap, DirectionsRenderer, useLoadScript, Autocomplete } from "@react-google-maps/api";
import adminServices from "../../../services/adminOrder/adminServices";

const libraries = ["places"];

const AdminOrderForm = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    dimensions: "",
    weightValue: "",
    vehicleType: "car",
    distance: "",
    paymentAmount: "",
  });

  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 });
  const [paymentAmount, setPaymentAmount] = useState("");
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
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
          setMapCenter({ lat: 24.7136, lng: 46.6753 }); // Default location Riyadh
        }
      );
    }
  }, []);

  useEffect(() => {
    setPaymentAmount("");
    if (formData.pickupLocation && formData.dropoffLocation) {
      calculateRoute();
    }
  }, [formData.pickupLocation, formData.dropoffLocation]);

  useEffect(() => {
    if (distance) {
      const match = distance.match(/[\d,]+(\.\d+)?/);
      if (match) {
        const distanceValueStr = match[0].replace(/,/g, "");
        const calculatedPayment = (distanceValueStr * 1.2).toFixed(3);
        setPaymentAmount(calculatedPayment);
      } else {
        setPaymentAmount("");
      }
    }
  }, [distance]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!formData.weightValue || isNaN(formData.weightValue)) {
      alert("Please enter a valid weight.");
      return;
    }

    if (!formData.dimensions || formData.dimensions.trim() === "") {
      alert("Please enter valid dimensions.");
      return;
    }

    let fullPaymentAmount = paymentAmount;
    if (formData.vehicleType.toLowerCase() === "suv") {
      fullPaymentAmount = paymentAmount * 1.5;
    } else if (formData.vehicleType.toLowerCase() === "truck") {
      fullPaymentAmount = paymentAmount * 2;
    }
    try {
      const response = await adminServices.newAdminOrder({
        customerId: "1",
        driverId: "11",
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        vehicleType: formData.vehicleType,
        dimensions: formData.dimensions,
        weightValue: formData.weightValue,
        orderStatus: "pending",
        paymentAmount: fullPaymentAmount,
        deliveryTime: '2024-11-10  '
      });
      console.log("Order created successfully", response);
    } catch (error) {
      console.error("Error creating order", error);
    }
  };

  const calculateRoute = () => {
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
            setDirections(result);
            const distance = result.routes[0]?.legs[0]?.distance?.text;
            setDistance(distance || "Distance unavailable");
          } else {
            console.error(`Error fetching directions: ${status}`);
            setDirections(null);
          }
        }
      );
    }
  };

  const onLoadPickup = (autocomplete) => {
    setPickupAutocomplete(autocomplete);
  };

  const onPlaceChangedPickup = () => {
    if (pickupAutocomplete !== null) {
      const place = pickupAutocomplete.getPlace();
      setFormData({ ...formData, pickupLocation: place.formatted_address });
    }
  };

  const onLoadDropoff = (autocomplete) => {
    setDropoffAutocomplete(autocomplete);
  };

  const onPlaceChangedDropoff = () => {
    if (dropoffAutocomplete !== null) {
      const place = dropoffAutocomplete.getPlace();
      setFormData({ ...formData, dropoffLocation: place.formatted_address });
    }
  };

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

      <div id="the-specs">
        {distance && <p>Est Distance: {distance}</p>}
        {distance && (
          <p>Rate: BD {formData.vehicleType === "suv" ? paymentAmount * 1.5 : formData.vehicleType === "truck" ? paymentAmount * 2 : paymentAmount}</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div id="form-container">
          <div>
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
          </div>

          <div>
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
          </div>

          <div>
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
          </div>

          <div>
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
          </div>

          <div id="dropdown">
            <label htmlFor="vehicleType">Vehicle type</label>
            <span>
              <select
                required
                name="vehicleType"
                id="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
              >
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
              </select>
            </span>
          </div>

          <div id="sub-button">
            <button id="submit" type="submit">SUBMIT</button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default AdminOrderForm;