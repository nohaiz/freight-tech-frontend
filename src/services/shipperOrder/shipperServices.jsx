const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const indexShipperOrders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/shippers/orders`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error);
    }
    return json;
  } catch (err) {
    console.log(err)
  }
}

const shipperOrderDetails = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/shippers/orders/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const json = await res.json()
    if (json.error) {
      throw new Error(json.error)
    }
    return json;
  } catch (err) {
    console.log(err)
  }
}

const updateShipperOrder = async (id, formData) => {
  console.log("Updating order with ID:", id);
  console.log("Form Data:", formData);

  try {
    const res = await fetch(`${BASE_URL}/shippers/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorText = await res.text(); // Get response text
      console.error("Error response:", errorText); // Log the response text
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Error during order update:", err);
  }
};


const deleteShipperOrder = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/shippers/orders/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error)
    }
    return json;
  } catch (err) {
    console.log(err);
  }
}

const newShipperOrder = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/shippers/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorDetails = await res.text();
      console.error(`Server responded with status ${res.status}: ${errorDetails}`);
      throw new Error(`Server responded with status ${res.status}: ${errorDetails}`);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Request failed:', error.message);
  }
};


export default { indexShipperOrders, shipperOrderDetails, updateShipperOrder, deleteShipperOrder, newShipperOrder };
