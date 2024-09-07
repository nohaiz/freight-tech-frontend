const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const indexDriverOrders = async () => {
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

const driverOrderDetails = async (id) => {
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

const updateDriverOrder = async (id, formData) => {
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

export default { indexDriverOrders, driverOrderDetails, updateDriverOrder };
