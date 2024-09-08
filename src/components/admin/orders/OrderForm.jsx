import { useState, useEffect } from "react";
import { GoogleMap, DirectionsRenderer, useLoadScript, Autocomplete } from "@react-google-maps/api";

const OrderForm = ({ handleAddOrder }) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    vehicle: "car",
    dimensions: "",
    weight: "",
  });

  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 }); // Riyadh coordinates
  const [rate, setRate] = useState("");
  const [fromAutocomplete, setFromAutocomplete] = useState(null);
  const [toAutocomplete, setToAutocomplete] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
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
          setMapCenter({ lat: 24.7136, lng: 46.6753 }); // Default location
        }
      );
    }
  }, []);

  useEffect(() => {
    setRate("");
    if (formData.from && formData.to) {
      calculateRoute();
    }
  }, [formData.from, formData.to]);

  useEffect(() => {
    if (distance) {
      const match = distance.match(/[\d,]+(\.\d+)?/);
      if (match) {
        const distanceValueStr = match[0].replace(/,/g, "");
        const calculatedRate = (distanceValueStr * 1.2).toFixed(3);
        setRate(calculatedRate);
      } else {
        setRate("");
      }
    }
  }, [distance]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (!formData.weight || isNaN(formData.weight)) {
      alert("Please enter a valid weight.");
      return;
    }

    if (!formData.dimensions || formData.dimensions.trim() === "") {
      alert("Please enter valid dimensions.");
      return;
    }

    let fullRate = rate;
    if (formData.vehicle.toLowerCase() === "suv") {
      fullRate = rate * 1.5;
    } else if (formData.vehicle.toLowerCase() === "truck") {
      fullRate = rate * 2;
    }

    // Call handleAddOrder passed from the parent component
    handleAddOrder(formData, fullRate);
  };

  const calculateRoute = () => {
    if (formData.from && formData.to) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: formData.from,
          destination: formData.to,
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

  const onLoadFrom = (autocomplete) => {
    setFromAutocomplete(autocomplete);
  };

  const onPlaceChangedFrom = () => {
    if (fromAutocomplete !== null) {
      const place = fromAutocomplete.getPlace();
      setFormData({ ...formData, from: place.formatted_address });
    }
  };

  const onLoadTo = (autocomplete) => {
    setToAutocomplete(autocomplete);
  };

  const onPlaceChangedTo = () => {
    if (toAutocomplete !== null) {
      const place = toAutocomplete.getPlace();
      setFormData({ ...formData, to: place.formatted_address });
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
          <p>Rate: BD {formData.vehicle === "SUV" ? rate * 1.5 : formData.vehicle === "Truck" ? rate * 2 : rate}</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div id="form-container">
          <div>
            <label htmlFor="from">Pick-up</label>
            <Autocomplete onLoad={onLoadFrom} onPlaceChanged={onPlaceChangedFrom}>
              <input
                placeholder="Pick-up Address"
                required
                type="text"
                name="from"
                id="from"
                value={formData.from}
                onChange={handleChange}
              />
            </Autocomplete>
          </div>

          <div>
            <label htmlFor="to">Dropoff</label>
            <Autocomplete onLoad={onLoadTo} onPlaceChanged={onPlaceChangedTo}>
              <input
                placeholder="Drop off Address"
                required
                type="text"
                name="to"
                id="to"
                value={formData.to}
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
            <label htmlFor="weight">Weight</label>
            <input
              placeholder="Weight"
              required
              type="text"
              name="weight"
              id="weight"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <div id="dropdown">
            <label htmlFor="vehicle">Vehicle type</label>
            <span>
              <select
                required
                name="vehicle"
                id="vehicle"
                value={formData.vehicle}
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

export default OrderForm;
