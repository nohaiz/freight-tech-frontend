import { useState } from "react"

const NewOrder = () => {
  const [formData, setFormData] = useState([])

  const handleChange = (e) => {

  }
  const handleSubmit = () => {

  }
  return (
    <>
      <form action="">

        <label htmlFor="pickupLocation">Pickup location</label>
        <input type="text" name="pickupLocation" id="pickupLocation" onChange={handleChange} />

        <label htmlFor="dropoffLocation">Drop off location</label>
        <input type="text" name="dropoffLocation" id="dropoffLocation" />

        <label htmlFor="paymentAmount"> Payment Amount</label>
        <input type="text" name="paymentAmount" id="paymentAmount" />

        <select name="vehicleType" id="vehicleType">
          <option value="car">Car</option>
          <option value="truck">Truck</option>
          <option value="van">Van</option>
        </select>

        <label htmlFor="dimensions">Dimensions</label>
        <input type="text" name="dimensions" id="dimensions" />

        <label htmlFor="weightValue">Weight value</label>
        <input type="text" name="weightValue" id="weightValue" />

        <label htmlFor="deliveryTime">Delivery time</label>
        <input type="text" name="deliveryTime" id="deliveryTime" />

        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default NewOrder