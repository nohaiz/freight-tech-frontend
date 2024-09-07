const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const indexShipperOrders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/drivers/orders`, {
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
    const res = await fetch(`${BASE_URL}/drivers/orders/${id}`, {
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
  try {
    const res = await fetch(`${BASE_URL}/drivers/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error)
    }
    return json
  } catch (err) {
    console.log(err)
  }
}

const deleteShipperOrder = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/drivers/orders/${id}`, {
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
    const res = await fetch(`${BASE_URL}/drivers/orders`, {
      method: 'POST',
      headers: {
        'ContentType': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")},`
      },
      body: Json.stringify(formData)
    });
  } catch (err) {
    console.log(err)
  }
}

export default { indexShipperOrders, shipperOrderDetails, updateShipperOrder, deleteShipperOrder, newShipperOrder };
